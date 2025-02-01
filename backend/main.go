package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/rs/cors"
)

func main() {
	corsOptions := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	http.HandleFunc("/convert", convertHandler)
	http.HandleFunc("/download", downloadHandler)
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads")))) 

	handler := corsOptions.Handler(http.DefaultServeMux)
	port := ":8080"

	fmt.Println("server is running on http://localhost" + port)
	log.Fatal(http.ListenAndServe(port, handler))
}
