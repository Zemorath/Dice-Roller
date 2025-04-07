package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

func rollDice(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	dice := vars["dice"] // e.g., "2d6"

	// Split dice notation (e.g., "2d6" -> "2" and "6")
	parts := strings.Split(dice, "d")
	if len(parts) != 2 {
		http.Error(w, "Invalid dice format. Use NdM (e.g., 2d6)", http.StatusBadRequest)
		return
	}

	count, err := strconv.Atoi(parts[0]) // Number of dice
	if err != nil || count < 1 {
		http.Error(w, "Invalid number of dice", http.StatusBadRequest)
		return
	}

	sides, err := strconv.Atoi(parts[1]) // Sides per die
	if err != nil || sides < 1 {
		http.Error(w, "Invalid die type", http.StatusBadRequest)
		return
	}

	// Seed random number generator
	rand.Seed(time.Now().UnixNano())

	// Roll the dice
	rolls := make([]int, count)
	total := 0
	for i := 0; i < count; i++ {
		rolls[i] = rand.Intn(sides) + 1 // 1 to sides
		total += rolls[i]
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"rolls": %v, "total": %d}`, rolls, total)
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/roll/{dice}", rollDice).Methods("GET")

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
