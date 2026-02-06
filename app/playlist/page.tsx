"use client";

import React, { useState } from "react";
import { PlusCircle, LogOut, Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  year: string;
  imageUrl: string;
}

const MovieDashboard = () => {
  const router = useRouter();

  const defaultMovies: Movie[] = [
    { id: 1, title: "Movie 1", year: "2021", imageUrl: "https://csspicker.dev/api/image/?q=movie+clapperboard&image_type=photo" },
    { id: 2, title: "Movie 2", year: "2021", imageUrl: "https://csspicker.dev/api/image/?q=laptop+netflix&image_type=photo" },
    { id: 3, title: "Movie 3", year: "2021", imageUrl: "https://csspicker.dev/api/image/?q=laptop+screen&image_type=photo" },
    { id: 4, title: "Movie 4", year: "2021", imageUrl: "https://csspicker.dev/api/image/?q=cinema+production&image_type=photo" },
  ];

  const [movies] = useState<Movie[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("movies");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return defaultMovies;
        }
      }
      localStorage.setItem("movies", JSON.stringify(defaultMovies));
    }
    return defaultMovies;
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /* ---------------- EDIT HANDLER ---------------- */
  const handleEditMovie = (movie: Movie) => {
    localStorage.setItem("editMovieId", movie.id.toString());
    setSelectedMovie(null);
    router.push("/edit");
  };

  return (
    <div className="h-screen w-screen bg-[#093545] text-white relative overflow-hidden">

      {/* SCALE WRAPPER */}
      <div
        className="w-full flex justify-center overflow-hidden"
        style={{ transform: "scale(0.8)", transformOrigin: "top center" }}
      >
        <div className="w-full">

          {/* HEADER */}
          <header className="max-w-6xl mx-auto w-full px-6 pt-16 pb-12 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-semibold">My movies</h1>

              <PlusCircle
                className="w-6 h-6 cursor-pointer hover:text-emerald-400"
                onClick={() => router.push("/add")}
              />
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 hover:text-emerald-400"
            >
              <span>Logout</span>
              <LogOut className="w-5 h-5" />
            </button>
          </header>

          {/* MOVIE GRID */}
          <main className="max-w-6xl mx-auto w-full px-6 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="bg-[#092C39] rounded-xl p-2 pb-4 hover:scale-[1.02] transition cursor-pointer"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4">
                    <Image src={movie.imageUrl} alt={movie.title} fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-medium">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.year}</p>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#092C39] rounded-xl p-6 w-[320px] text-center">
            <h2 className="text-lg font-semibold mb-4">Do you want to logout?</h2>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/signin")}
                className="flex-1 py-2 bg-[#22c55e] rounded-lg font-bold"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 border border-white rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOVIE DETAILS MODAL */}
      {selectedMovie && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-[#092C39] rounded-xl p-6 w-[340px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-xl text-white/70"
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>

            <button
              onClick={() => handleEditMovie(selectedMovie)}
              className="absolute bottom-4 right-4 bg-[#22c55e] p-3 rounded-full"
            >
              <Pen className="w-4 h-4 text-white" />
            </button>

            <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4">
              <Image src={selectedMovie.imageUrl} alt={selectedMovie.title} fill className="object-cover" />
            </div>

            <h3 className="text-xl font-semibold">{selectedMovie.title}</h3>
            <p className="text-sm text-gray-300">{selectedMovie.year}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDashboard;
