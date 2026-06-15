'use client';

// Convierte un enlace normal de YouTube en uno para incrustar (embed).
function youtubeEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // Formato watch?v=ID
    if (u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    // Formato youtu.be/ID
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // Formato /live/ID o /embed/ID
    const partes = u.pathname.split('/').filter(Boolean);
    const idx = partes.findIndex((p) => p === 'live' || p === 'embed');
    if (idx >= 0 && partes[idx + 1]) {
      return `https://www.youtube.com/embed/${partes[idx + 1]}`;
    }
    // Canal en vivo: .../@canal/live  -> no se puede incrustar por ID,
    // se deja el enlace tal cual para abrir en YouTube.
    return null;
  } catch {
    return null;
  }
}

export default function TransmisionesVivo({ facebookUrl, papaUrl, mexicoUrl }) {
  const papaEmbed = youtubeEmbed(papaUrl);
  const mexicoEmbed = youtubeEmbed(mexicoUrl);

  const hayAlgo = facebookUrl || papaUrl || mexicoUrl;
  if (!hayAlgo) return null;

  const fbEmbed = facebookUrl
    ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(facebookUrl)}&show_text=false&width=560`
    : null;

  return (
    <div className="vivo-seccion">
      <div className="titulo-seccion reveal">
        <span className="eyebrow">En vivo</span>
        <h2>Transmisiones en vivo</h2>
        <p>Acompáñanos en la Eucaristía a través de nuestras transmisiones y las de la Iglesia.</p>
      </div>

      <div className="vivo-grid">
        {facebookUrl && (
          <div className="vivo-card reveal">
            <h3>Misa de nuestra parroquia</h3>
            <p className="vivo-nota">Cuando estemos transmitiendo en Facebook, el video aparecerá aquí.</p>
            <div className="vivo-video">
              <iframe
                src={fbEmbed}
                title="Transmisión de Facebook"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="boton ghost chico">Ver en Facebook ↗</a>
          </div>
        )}

        {papaUrl && (
          <div className="vivo-card reveal">
            <h3>Misa del Papa / Vaticano</h3>
            {papaEmbed ? (
              <div className="vivo-video">
                <iframe
                  src={papaEmbed}
                  title="Misa del Papa"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="vivo-nota">Da clic abajo para ver la transmisión.</p>
            )}
            <a href={papaUrl} target="_blank" rel="noopener noreferrer" className="boton ghost chico">Ver transmisión ↗</a>
          </div>
        )}

        {mexicoUrl && (
          <div className="vivo-card reveal">
            <h3>Misa de México</h3>
            {mexicoEmbed ? (
              <div className="vivo-video">
                <iframe
                  src={mexicoEmbed}
                  title="Misa de México"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="vivo-nota">Da clic abajo para ver la transmisión.</p>
            )}
            <a href={mexicoUrl} target="_blank" rel="noopener noreferrer" className="boton ghost chico">Ver transmisión ↗</a>
          </div>
        )}
      </div>
    </div>
  );
}
