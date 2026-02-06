"use client";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';

const MovieForm = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !year) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Submit to backend as JSON
      const res = await fetch("http://localhost:3001/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          year,
          imageUrl: preview || "https://csspicker.dev/api/image/?q=movie+clapperboard&image_type=photo",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Failed to add movie: ${error.error?.message || "Unknown error"}`);
        return;
      }

      const newMovie = await res.json();

      // Get existing movies from localStorage
      const stored = localStorage.getItem("movies");
      const movies = stored ? JSON.parse(stored) : [];

      // Add new movie
      const movieToAdd = {
        id: newMovie.id || Date.now(),
        title: newMovie.title,
        year: newMovie.year,
        imageUrl: newMovie.imageUrl || preview || "https://csspicker.dev/api/image/?q=movie+clapperboard&image_type=photo",
      };

      movies.push(movieToAdd);
      localStorage.setItem("movies", JSON.stringify(movies));

      // Redirect to playlist
      router.push("/playlist");
    } catch (err) {
      console.error("Error adding movie:", err);
      alert("Error adding movie");
    }
  };

return (
  <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#0b3a46] to-[#062a33] overflow-hidden">

    {/* 🔥 SCALE THIS CONTAINER */}
    <div
      style={{
        transform: "scale(0.6)",   // try 0.65 – 0.75
        transformOrigin: "center",
      }}
      className="w-full flex justify-center"
    >

      {/* ✅ EVERYTHING GOES INSIDE */}
      <div className="w-full max-w-5xl z-10">

        <h1 className="text-white text-3xl font-semibold mb-16 md:mb-2">
          Create a new movie
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-12 md:gap-10"
        >
          {/* Image Upload Area */}
          <div className="flex-1">
            <label className="relative flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-white/40 bg-[#224957] hover:bg-[#2a5666] transition-colors cursor-pointer overflow-hidden">
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 text-white mb-2" />
                  <p className="text-sm text-white font-light">
                    Drop an image here
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Form Inputs */}
          <div className="flex-1 flex flex-col space-y-6">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#224957] text-white rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Publishing year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-[250px] bg-[#224957] text-white rounded-lg px-4 py-3"
            />

            <div className="flex gap-4 pt-8">
             <button
  type="button"
  onClick={() => router.push("/main")}
  className="flex-1 py-3 px-6 border border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
>
  Cancel
</button>

              <button
                type="submit"
                className="flex-1 py-3 bg-[#22c55e] text-white rounded-lg hover:bg-green-500 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
        
        body {
          font-family: 'Montserrat', sans-serif;
        }

        input::placeholder {
          font-size: 14px;
        }
      `}</style>
      {/* Bottom Waves */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[220px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#0c4f5a"
            fillOpacity="0.55"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,218.7C672,224,768,224,864,202.7C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L0,320Z"
          />
        </svg>

        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[220px] absolute bottom-0 left-0 transform scale-x-[-1]"
          preserveAspectRatio="none"
        >
          <path
            fill="#0c4f5a"
            fillOpacity="0.35"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,218.7C672,224,768,224,864,202.7C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default MovieForm;