import './App.css'
import * as facemesh from "@tensorflow-models/facemesh"
import Webcam from 'react-webcam'
import { useEffect, useRef } from 'react'
import "@tensorflow/tfjs-backend-webgl"
import { drawMesh } from './utils'

function App() {

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const runFacemesh = async () => {
    const net = await facemesh.load({
      maxFaces: 1,
    });

    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net: any) => {
    if (webcamRef.current && canvasRef.current && typeof webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {

      const videoElement = webcamRef.current.video;

      if (!videoElement) return;

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      const face = await net.estimateFaces(videoElement);
      console.log(face);

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);

    }
  };

  useEffect(() => {
    runFacemesh();
  }, []);



  return (
    <>
      <section>
        <header className="App-header">

          <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: 640,
              height: 480,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 20,
              width: 640,
              height: 480,
            }}></canvas>

          <p>Webcam test</p>
        </header>
      </section>
    </>
  )
}

export default App

