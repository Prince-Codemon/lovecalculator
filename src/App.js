import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsFillSuitHeartFill } from "react-icons/bs";
import confetti from "canvas-confetti";
import { useEffect } from "react";
const fenti = () => {
  var end = Date.now() + 15 * 1000;

  // go Buckeyes!
  var colors = ["#bb0000", "#ffffff"];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

const App = () => {
  const [name, setName] = useState("");
  const [partner, setPartner] = useState("");
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !partner) {
      return toast("Single ho kya ?", {
        icon: "😜",
      });
    }
    if (name.length < 3 || partner.length < 3) {
      return toast("Babu naam to sahi daal", {
        icon: "😅",
      });
    }
    if (name === partner) {
      return toast("Chacha itna bhi self love nhi ", {
        icon: "😍",
      });
    }
    if (!/^[a-zA-Z\s]+$/.test(name) || !/^[a-zA-Z\s]+$/.test(partner)) {
      return toast("Nibo naam likho no nhi ", {
        icon: "🤣",
      });
    }

    if (name && partner) {
      setLoading(true);
      setResult("");
      await axios
        .request({
          method: "GET",
          url: "https://love-calculator.p.rapidapi.com/getPercentage",
          params: { sname: name, fname: partner },
          headers: {
            "X-RapidAPI-Key":
              "0a57b812cfmshf57f22a8fa322a8p1fb8dbjsne822ba2c900a",
            "X-RapidAPI-Host": "love-calculator.p.rapidapi.com",
          },
        })
        .then(async function (response) {
          const image = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=1Z1Y1XFkqR2kYiBiK3QEXPZ8FtDAtmrQ&q=${
              response.data.percentage +
              "love" +
              response.data.result +
              " in love"
            }&limit=25&offset=0&rating=g&lang=en`
          );
          const data = await image.json();
          setImg(
            data.data[Math.floor(Math.random() * data.data.length)].images
              .original.url
          );
          try {
            const res = await fetch(
              `${process.env.REACT_APP_FIREBASE_URL}`,
              {
                method: "POST",
                body: JSON.stringify({
                  name: name,
                  crush: partner,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          setShow(true);
          setResult(response.data.result);
          setPercentage(response.data.percentage);
        })
        .catch(function (error) {
          console.error(error);
        });

      setLoading(false);
    }
  };

  useEffect(() => {
    if (percentage >= 90) {
      fenti();
    }
  }, [percentage]);
  return (
    <div className="love-wrapper">
      {!show && <BsFillSuitHeartFill className="heart" />}
      {!show && (
        <form onSubmit={handleSubmit}>
          <h1>Love Calculator ❤️ </h1>

          <input
            type=" 
          text
          "
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name"
          />

          <input
            type="text"
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
            placeholder="your crush name"
          />

          <button>Calculate</button>
        </form>
      )}

      {show && (
        <div className="result">
          <p>{loading ? "Loading..." : result}</p>
          <p>
            Love Percentage:{" "}
            <span>{loading ? "Loading..." : percentage + "%"}</span>
          </p>
          <img src={img} alt="" />
          <button
            onClick={() => {
              setShow(false);
              setName("");
              setPartner("");
              setResult("");
              setPercentage("");
              setImg("");
            }}
          >
            New Calculate
          </button>
        </div>
      )}

      <div className="footer">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://www.princecodemon.live/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @princecodemon
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;
