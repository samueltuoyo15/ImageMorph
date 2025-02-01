package main

import (
	"encoding/json"
	"image"
	"image/jpeg"
	"image/png"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"github.com/Kodeworks/golang-image-ico"
	"github.com/kolesa-team/go-webp/encoder"
	"github.com/kolesa-team/go-webp/webp"
)

type ConvertedImage struct {
	URL  string `json:"url"`
	Size int64  `json:"size"`
}

func convertHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to read image", http.StatusBadRequest)
		return
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		http.Error(w, "Invalid image format", http.StatusBadRequest)
		return
	}

	formats := []string{"png", "jpeg", "webp", "ico"}

	uploadDir := "uploads/"
	os.MkdirAll(uploadDir, os.ModePerm)

	var convertedImages []ConvertedImage

	for _, f := range formats {
		outputPath := filepath.Join(uploadDir, strings.TrimSuffix(header.Filename, filepath.Ext(header.Filename))+"."+f)
		outFile, err := os.Create(outputPath)
		if err != nil {
			http.Error(w, "Failed to save converted image", http.StatusInternalServerError)
			return
		}
		defer outFile.Close()

		switch f {
		case "png":
			err = png.Encode(outFile, img)
		case "jpeg":
			err = jpeg.Encode(outFile, img, &jpeg.Options{Quality: 70})
		case "webp":
			options, _ := encoder.NewLossyEncoderOptions(encoder.PresetDefault, 80)
			err = webp.Encode(outFile, img, options)
		case "ico":
			err = ico.Encode(outFile, img)
		}

		if err != nil {
			http.Error(w, "Image conversion failed", http.StatusInternalServerError)
			return
		}

		fileInfo, _ := outFile.Stat()
		convertedImages = append(convertedImages, ConvertedImage{
			URL:  "/" + outputPath,
			Size: fileInfo.Size(),
		})
	}

	response := struct {
		Message string           `json:"message"`
		Images  []ConvertedImage `json:"images"`
	}{
		Message: "Image uploaded and converted",
		Images:  convertedImages,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
