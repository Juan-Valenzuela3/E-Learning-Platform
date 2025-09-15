import { useEffect, useRef, useState } from "react";

const YoutubePlayer = ({ videoId, containerId }) => {
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    // Cargar el script de la API de YouTube si no está cargado
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Función para inicializar el reproductor
    const initializePlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player(containerId, {
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              setPlayer(event.target);
            },
            onError: (event) => {
              console.error('Error al cargar el video:', event.data);
            }
          }
        });
      }
    };

    // Si la API ya está cargada, inicializar directamente
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      // Si no, esperar a que esté lista
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    // Limpieza al desmontar
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, containerId]);

  return null; // No renderizamos nada, solo usamos el contenedor
};

export { YoutubePlayer };

export const useYoutubePlayer = (videoId) => {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const play = () => playerRef.current?.playVideo?.();
  const pause = () => playerRef.current?.pauseVideo?.();
  const stop = () => playerRef.current?.stopVideo?.();

  return { playerRef, play, pause, stop, isReady };
};

