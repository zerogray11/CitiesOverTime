import React from "react";

const ArticlePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="p-12">
          <h1
            className="text-5xl font-extrabold mb-6 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-600 to-blue-500 
            animate-gradient-x
            leading-tight tracking-tight
          "
          >
            The Future of Cities
          </h1>

          <div className="space-y-6 text-white/90">
            <p className="text-xl leading-relaxed border-l-4 border-blue-500 pl-4">
              In this article, we explore the cities of the future and how
              technology is reshaping urban living. Cities are becoming smarter,
              more efficient, and increasingly connected. With innovations in
              AI, IoT, and sustainable urban design, the cities of tomorrow will
              be radically different from those we know today.
            </p>

            <p className="text-lg leading-relaxed opacity-80">
              More content can go here. You can add multiple paragraphs, images,
              and other media to fully articulate your article, creating a
              comprehensive view of urban innovation and technological
              transformation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
