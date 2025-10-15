"use client";

import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const apiBase = "http://127.0.0.1:8000/api";
  const limit = 12;

  const loadPokemon = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/pokemon?limit=${limit}&offset=${offset}${search ? `&search=${search}` : "" }`);
      if (!res.ok) throw new Error("Failed to fetch Pokémon");
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
        return;
      }
      setPokemon((prev) => [...prev, ...data]);
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // Infinite scroll setup
  const loaderRef = useRef(null);
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setOffset((prev) => prev + limit);
        }
      },
      { threshold: 1 }
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);

    // Cleanup
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [loading, hasMore, search]);

  // Filter Pokémon by name
  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Carousel settings
  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    dots: true,
    arrows: false,
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* === TOP ROW === */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4 items-start">
          {/* LEFT: Carousel */}
          <div className="col-span-12 md:col-span-9">
            <div className="rounded-lg overflow-hidden bg-white shadow">
              <Slider {...sliderSettings}>
                <div>
                  <img
                    src="/banner-left-1.jpg"
                    alt="banner 1"
                    className="w-full h-56 md:h-64 object-cover"
                  />
                </div>
                <div>
                  <img
                    src="/banner-left-2.jpg"
                    alt="banner 2"
                    className="w-full h-56 md:h-64 object-cover"
                  />
                </div>
                <div>
                  <img
                    src="/banner-left-3.jpg"
                    alt="banner 3"
                    className="w-full h-56 md:h-64 object-cover"
                  />
                </div>
              </Slider>
            </div>
          </div>

          {/* RIGHT: 2 static banners */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
            <img
              src="/banner-right-top.jpg"
              alt="right banner 1"
              className="w-full h-28 object-cover rounded-lg shadow"
            />
            <img
              src="/banner-right-bottom.jpg"
              alt="right banner 2"
              className="w-full h-28 object-cover rounded-lg shadow"
            />
          </div>
        </div>
      </div>

      {/* === MAIN BODY === */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT static image */}
          <aside className="hidden lg:block col-span-12 xl:col-span-2 lg:col-span-3">
            <div className="sticky top-28">
              <div className="bg-white rounded-lg p-4 shadow h-96 flex items-center justify-center">
                <img src="/left-static.png" alt="left static" className="object-contain h-full" />
              </div>
            </div>
          </aside>

          {/* CENTER scrollable Pokémon list */}
          <section className="col-span-12 lg:col-span-6 xl:col-span-8">
            <div className="bg-white rounded-lg shadow p-4">
              {/* Search bar */}
              <div className="sticky top-0 bg-white z-10 pb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Pokemon Name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder-gray-500"
                  />
                  <button
                    className="bg-yellow-400 text-white font-medium px-4 py-2 rounded-md shadow-sm"
                    disabled
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Pokémon grid */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPokemon.map((p, index) => (
                  <div
                    key={`${p.name}-${index}`}
                    className="bg-white border border-gray-200 rounded p-3 flex items-center gap-3 shadow-sm"
                  >
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold capitalize text-black">{p.name}</div>

                      <div className="mt-1 text-xs text-gray-500">
                        {p.types?.map((t) => (
                          <span
                            key={`${p.name}-type-${t}`}
                            className="inline-block mr-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="mt-2 text-xs text-gray-400">
                        H: {(p.height / 10).toFixed(1)} m • W: {(p.weight / 10).toFixed(1)} kg
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite scroll trigger */}
              {!search && hasMore && (
                <div ref={loaderRef} className="text-center py-6 text-gray-500">
                  {loading ? "Loading more Pokémon..." : "Scroll to load more"}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT static image */}
          <aside className="hidden lg:block col-span-12 xl:col-span-2 lg:col-span-3">
            <div className="sticky top-28">
              <div className="bg-white rounded-lg p-4 shadow h-96 flex items-center justify-center">
                <img src="/right-static.png" alt="right static" className="object-contain h-full" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
