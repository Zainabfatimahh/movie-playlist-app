'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Movie {
  id: string;
  title: string;
  year: number;
  image: string;
}

export default function BrowsePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Movie[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
      router.push('/signin');
      return;
    }

    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Simulate featured movies
    setFeatured([
      {
        id: '1',
        title: 'The Matrix',
        year: 1999,
        image: 'https://csspicker.dev/poster1.jpg'
      },
      {
        id: '2',
        title: 'Inception',
        year: 2010,
        image: 'https://csspicker.dev/poster2.jpg'
      },
      {
        id: '3',
        title: 'Interstellar',
        year: 2014,
        image: 'https://csspicker.dev/poster3.jpg'
      },
      {
        id: '4',
        title: 'The Dark Knight',
        year: 2008,
        image: 'https://csspicker.dev/poster4.jpg'
      },
      {
        id: '5',
        title: 'Pulp Fiction',
        year: 1994,
        image: 'https://csspicker.dev/poster5.jpg'
      },
      {
        id: '6',
        title: 'Forrest Gump',
        year: 1994,
        image: 'https://csspicker.dev/poster6.jpg'
      }
    ]);

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/signin');
  };

  const handleAddMovie = (movie: Movie) => {
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    router.push('/add');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold">Browse Movies</h1>
          <p className="text-gray-400 mt-2">Discover and add movies to your collection</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Featured Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Films</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((movie) => (
            <div
              key={movie.id}
              className="group bg-[#1e293b] rounded-lg overflow-hidden border border-[#334155] hover:border-[#22c55e] transition"
            >
              <div className="relative h-64 bg-[#0f172a]">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center">
                  <button
                    onClick={() => handleAddMovie(movie)}
                    className="opacity-0 group-hover:opacity-100 transition bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                  >
                    Add to Collection
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                <p className="text-gray-400">{movie.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 text-center">
        <p className="text-gray-400 mb-4">Ready to manage your collection?</p>
        <button
          onClick={() => router.push('/playlist')}
          className="bg-[#3b82f6] hover:bg-[#2563eb] px-6 py-2 rounded-lg font-bold transition"
        >
          Go to My Movies
        </button>
      </div>
    </div>
  );
}
