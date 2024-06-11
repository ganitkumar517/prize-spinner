import React, { Component, useState } from "react";

import WheelComponent from "./weel";
import "react-wheel-of-prizes/dist/index.css";
import "./styles.css";
import IMAGES from "./assets";

import TrPortal from "./portal";
import Confetti from "react-confetti";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portal: false,
      show: false,
    };
  }

  render() {
    const segments = [
      'Better luck next time',
      '10% subsidy on loan amount',
      'Noise cancellation earphones worth ₹2,999',
      'Smart watch worth ₹4,999',
      'Free visa assistance',
      'Better luck next time',
      '3 months Netflix subscription',
      'Sunglasses worth ₹2,999',
      'Free guidance Travel bag',
      '₹1000 off on Air tickets',
      'Amazon gift card worth ₹500',
      'Study tablet worth ₹19,999'
    ];

    const weelColors = () => {
      let arr = [];
      let colors = [
        ["#4459CC", "#FF5184"],
        ["#FFFFFF", "#FFFFFF"],
      ];;
      segments.forEach((el) => {
        let color = colors.shift();
        arr.push(color);
        colors.push(color);
      });

      return arr;
    };
    const segColors = weelColors();

    const onFinished = (winner) => {
      this.setState({ portal: false, show: winner });
    };
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "150px",
          paddingBottom: "150px",
        }}
      >
        {this.state.show && <Confetti width={1600} height={1019} />}
        <WheelComponent
          segments={segments}
          segColors={segColors}
          winningSegment={"8"}
          onFinished={(winner) => onFinished(winner)}
          primaryColor="#1028A4"
          contrastColor={["white"]}
          textColor={["white", 'black']}
          buttonText="Play"
          isOnlyOnce={true}
        />
        {this.state.portal ? <TrPortal /> : null}
        {this.state.show && (
          // modal
          <div className="box">
            <div className="imageBox"></div>
            <h2 className="titleWin">
              CONGRATULATIONS!!! YOU HAVE WON {this.state.show} !!!
            </h2>
            <div className="closeContainer">
              <button
                className="closepankaj"
                onClick={() => this.setState({ show: false })}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
