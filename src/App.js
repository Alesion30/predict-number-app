import React from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@material-ui/core";
import AccuracyTable from "./components/AccuracyTable";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      is_loading: "is-loading",
      model: null,
      maxNumber: null,
      maxScore: null
    };
    this.onRef = this.onRef.bind(this);
    this.getImageData = this.getImageData.bind(this);
    this.getAccuracyScores = this.getAccuracyScores.bind(this);
    this.predict = this.predict.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    tf.loadModel(
      "https://raw.githubusercontent.com/tsu-nera/tfjs-mnist-study/master/model/model.json"
    ).then(model => {
      this.setState({
        is_loading: "",
        model
      });
    });
  }

  onRef(ref) {
    this.signaturePad = ref;
  }

  getAccuracyScores(imageData) {
    const scores = tf.tidy(() => {
      const channels = 1;
      let input = tf.fromPixels(imageData, channels);
      input = tf.cast(input, "float32").div(tf.scalar(255));
      input = input.expandDims();
      return this.state.model.predict(input).dataSync();
    });
    return scores;
  }

  getImageData() {
    return new Promise(resolve => {
      const context = document.createElement("canvas").getContext("2d");
      const image = new Image();
      const width = 28;
      const height = 28;

      image.onload = () => {
        context.drawImage(image, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);

        for (let i = 0; i < imageData.data.length; i += 4) {
          const avg =
            (imageData.data[i] +
              imageData.data[i + 1] +
              imageData.data[i + 2]) /
            3;
          imageData.data[i] = avg;
          imageData.data[i + 1] = avg;
          imageData.data[i + 2] = avg;
        }
        resolve(imageData);
      };

      image.src = this.signaturePad.toDataURL();
    });
  }

  predict() {
    this.getImageData()
      .then(imageData => this.getAccuracyScores(imageData))
      .then(accuracyScores => {
        const maxAccuracy = accuracyScores.indexOf(
          Math.max.apply(null, accuracyScores)
        );
        const elements = document.querySelectorAll(".accuracy");
        elements.forEach(el => {
          el.parentNode.classList.remove("is-selected");
          const rowIndex = Number(el.dataset.rowIndex);
          if (maxAccuracy === rowIndex) {
            el.parentNode.classList.add("is-selected");
          }
          el.innerText = Math.round(accuracyScores[rowIndex] * 1000) / 1000;
        });
        this.setState({
          maxNumber: maxAccuracy,
          maxScore: accuracyScores[maxAccuracy]
        });
        console.log(accuracyScores);
      });
  }

  reset() {
    this.setState({
      maxNumber: null
    });
    this.signaturePad.clear();
    const elements = document.querySelectorAll(".accuracy");
    elements.forEach(el => {
      el.parentNode.classList.remove("is-selected");
      el.innerText = "-";
    });
  }

  render() {
    let text = "数字を入力してください";
    if (this.state.maxNumber !== null) {
      if (this.state.maxScore > 0.999) {
        text = `この数字は確実に${this.state.maxNumber}です。`;
      } else if (this.state.maxScore > 0.9) {
        text = `この数字はほぼ間違いなく${this.state.maxNumber}です。`;
      } else if (this.state.maxScore > 0.5) {
        text = `この数字は多分${this.state.maxNumber}です。`;
      } else {
        text = `この数字は${this.state.maxNumber}かもしれないです。`;
      }
    }
    return (
      <div className="container">
        <h2>{text}</h2>
        <div className="canbas">
          <SignatureCanvas
            ref={this.onRef}
            minWidth={15}
            maxWidth={15}
            penColor="white"
            backgroundColor="black"
            canvasProps={{
              width: 420,
              height: 420,
              className: "sigCanvas"
            }}
            onEnd={this.predict}
          />
        </div>
        <div className="button">
          <Button variant="contained" onClick={this.reset}>
            reset
          </Button>
        </div>
        <AccuracyTable />
      </div>
    );
  }
}

export default App;
