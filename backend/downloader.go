package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"sync"
)

type VideoMetadata struct {
	Title     string      `json:"title"`
	Thumbnail string      `json:"thumbnail"`
	Duration  int         `json:"duration"`
	Category  string      `json:"category"`
	Links     []VideoLink `json:"links"`
}

type VideoLink struct {
	Link    string `json:"link"`
	Quality string `json:"quality"`
}

var cache = make(map[string]VideoMetadata)
var mu sync.RWMutex

func downloadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid Request Method", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	videoURL := r.URL.Query().Get("url")
	if videoURL == "" {
		http.Error(w, "Missing video URL", http.StatusBadRequest)
		return
	}

	mu.RLock()
	cachedData, found := cache[videoURL]
	mu.RUnlock()
	if found {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(cachedData)
		return
	}

	videoData, err := fetchVideoData(videoURL)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to fetch metadata: %s", err.Error()), http.StatusInternalServerError)
		return
	}

	mu.Lock()
	cache[videoURL] = videoData
	mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(videoData)
}

func fetchVideoData(videoURL string) (VideoMetadata, error) {
	cmd := exec.Command("yt-dlp", "-j", "--no-playlist", videoURL)
	output, err := cmd.Output()
	if err != nil {
		return VideoMetadata{}, fmt.Errorf("failed to fetch metadata: %s", err.Error())
	}

	var metadata map[string]interface{}
	if err := json.Unmarshal(output, &metadata); err != nil {
		return VideoMetadata{}, fmt.Errorf("failed to parse metadata: %s", err.Error())
	}

	videoData := VideoMetadata{}
	if title, ok := metadata["title"].(string); ok {
		videoData.Title = title
	} else {
		videoData.Title = "Unknown Title"
	}

	if thumbnail, ok := metadata["thumbnail"].(string); ok {
		videoData.Thumbnail = thumbnail
	} else {
		videoData.Thumbnail = "No Thumbnail"
	}

	if duration, ok := metadata["duration"].(float64); ok {
		videoData.Duration = int(duration)
	} else {
		videoData.Duration = 0
	}

	if categories, ok := metadata["categories"].([]interface{}); ok && len(categories) > 0 {
		if category, ok := categories[0].(string); ok {
			videoData.Category = category
		} else {
			videoData.Category = "Uncategorized"
		}
	} else {
		videoData.Category = "Uncategorized"
	}

	var links []VideoLink
	if formats, ok := metadata["formats"].([]interface{}); ok {
		for _, format := range formats {
			if formatMap, ok := format.(map[string]interface{}); ok {
				if url, ok := formatMap["url"].(string); ok {
					if quality, ok := formatMap["format"].(string); ok {
						links = append(links, VideoLink{
							Link:    url,
							Quality: quality,
						})
					}
				}
			}
		}
	}
	videoData.Links = links

	return videoData, nil
}

