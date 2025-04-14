package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

func rollDice(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "https://dice-roller-frontend.onrender.com")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	vars := mux.Vars(r)
	dice := vars["dice"]

	parts := strings.Split(dice, "d")
	if len(parts) != 2 {
		http.Error(w, "Invalid dice format. Use NdM (e.g., 2d6)", http.StatusBadRequest)
		return
	}

	count, err := strconv.Atoi(parts[0])
	if err != nil || count < 1 {
		http.Error(w, "Invalid number of dice", http.StatusBadRequest)
		return
	}

	sides, err := strconv.Atoi(parts[1])
	if err != nil || sides < 1 {
		http.Error(w, "Invalid die type", http.StatusBadRequest)
		return
	}

	rand.Seed(time.Now().UnixNano())
	rolls := make([]int, count)
	total := 0
	for i := 0; i < count; i++ {
		rolls[i] = rand.Intn(sides) + 1
		total += rolls[i]
	}

	response := map[string]interface{}{
		"rolls": rolls,
		"total": total,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response) // Proper JSON encoding
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/roll/{dice}", rollDice).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Fallback for local dev
	}
	log.Printf("Starting server on :%s", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, router))
}
