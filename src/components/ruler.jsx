/* eslint-disable no-unused-expressions */
import React, { Component } from "react";

import "./styles.css";

class ruler extends Component {
  constructor(props) {
    super(props);
    this.options = {
      canvasWidth: document.body.clientWidth || 375,
      canvasHeight: 83,
      boxColor: "#E4E4E4",
      scrollLeft: 0,
      heightDecimal: 35,
      heightDigit: 0,
      lineWidth: 2,
      colorDecimal: "#E4E4E4",
      colorDigit: "#E4E4E4",
      divide: 4,
      precision: 1,
      fontSize: 12,
      fontColor: "#666",
      fontMarginTop: 35,
      // maxValue: 86400,
      maxValue: 360,
      minValue: 0,
      currentValue: 86380,
    };

    this.localState = {
      startX: 0,
      startY: 0,
    };

    this.state = {
      isMouseDown: false,
      value: 0,
      date:5,
      month:'',
      year:'',
      date: new Date(),
      startTimeDate: {
        startDate: 7,
        startMonth: 6,
        startYear: 2020,
        startHours: 0,
        startMinutes: 0,
        startSeconds: 0,
      },
      endTimeDate: {
        endDate: null,
        endMonth: null,
        endYear: null,
        endHours: null,
        endMinutes: null,
        endSeconds: null,
      },
    };
  }

  componentDidMount() {
    const { canvasWidth, canvasHeight } = this.options;
    let canvas = document.getElementById("timeline");

    canvas.width = canvasWidth * 2;
    canvas.height = canvasHeight * 2;
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";
    if (this.browserEnv) {
      canvas.ontouchstart = this.touchStart.bind(this);
      canvas.ontouchmove = this.touchMove.bind(this);
      canvas.ontouchend = this.touchEnd.bind(this);
    } else {
      canvas.onmousedown = this.touchStart.bind(this);
      canvas.onmousemove = this.touchMove.bind(this);
      canvas.onmouseup = this.touchEnd.bind(this);
    }
    this.drawRuler();
    
  }

  touchStart(e) {
    // console.log("e start: ", e);
    this.setState({
      isMouseDown: true,
    });
    e.preventDefault();
    if (e) {
      let touch = e;
      this.localState.startX = touch.pageX;
      this.localState.startY = touch.pageY;
    }
  }

  touchMove(e) {
    if (this.state.isMouseDown) {
      // console.log("e touchMove", e);

      if (!this.browserEnv && (e.which !== 1 || e.buttons === 0)) return;
      let touch = e,
        deltaX = touch.pageX - this.localState.startX;

      this.moveDreaw(deltaX);
      this.localState.startX = touch.pageX;
      this.localState.startY = touch.pageY;
    }
  }

  touchEnd(e) {
    // console.log("e end", e);

    this.setState({
      isMouseDown: false,
    });
  }

  moveDreaw(deltaX) {
    const { divide, precision } = this.options;
    let moveValue = Math.round(-deltaX / divide),
      _moveValue = Math.abs(moveValue),
      draw = () => {
        if (_moveValue < 1) {
          return;
        }
        this.options.currentValue += Math.sign(moveValue) * precision;
        // this.options.currentValue += 600;

        if (this.state.isMouseDown) {
          requestAnimationFrame(draw);
        }

        this.drawRuler();
        _moveValue--;
      };
    draw();
  }

  drawRuler = () => {
    const canvas = document.getElementById("timeline"),
      context = canvas.getContext("2d");
    // eslint-disable-next-line no-self-assign
    canvas.height = canvas.height;
    let {
      canvasWidth,
      canvasHeight,
      maxValue,
      minValue,
      currentValue,
      precision,
      divide,
      heightDecimal,
      heightDigit,
      lineWidth,
      colorDecimal,
      colorDigit,
      fontSize,
      fontColor,
      fontMarginTop,
    } = this.options;

    let { startTimeDate, endTimeDate } = this.state;

    // console.log('startTimeDate', startTimeDate);
    // console.log('endTimeDate', endTimeDate);
    

    // let y = endTimeDate.endYear - startTimeDate.startYear;
    // let m = endTimeDate.endMonth - startTimeDate.startMonth;
    // let d = endTimeDate.endDate - startTimeDate.startDate;
    // let h = endTimeDate.endHours - startTimeDate.startHours;
    // let minu = endTimeDate.endMinutes - startTimeDate.startMinutes;
    // let s = endTimeDate.endSeconds - startTimeDate.startSeconds;

    // let maxCurrentValue = s + (minu * 60) + (h * 3600) + ( d * 86400) + ( m * 2592000 );
    // console.log('maxCurrentValue', maxCurrentValue);

      // currentValue =
      // currentValue > minValue
      //   ? currentValue < maxValue
      //     ? currentValue
      //     : maxValue
      //   : minValue;
   
    
    currentValue =
      (Math.round((currentValue * 10) / precision) * precision) / 10;
    this.options.currentValue = currentValue;

    // console.log('currentValue: ', currentValue);

    this.handleValue(currentValue);

    let diffCurrentMin = ((currentValue - minValue) * divide) / precision;
    let startValue =
      currentValue - Math.floor(canvasWidth / 2 / divide) * precision;
    startValue =
      startValue > minValue
        ? startValue < maxValue
          ? startValue
          : maxValue
        : minValue;
    let endValue = startValue + (canvasWidth / divide) * precision;
    endValue = endValue < maxValue ? endValue : maxValue;

    if (endValue === maxValue) {
      endValue = currentValue + maxValue ;

      // maxValue = currentValue;
    }

    // if (
    //   startTimeDate.startHours === endTimeDate.endHours &&
    //   startTimeDate.startMinutes === endTimeDate.endMinutes &&
    //   startTimeDate.startSeconds === endTimeDate.endSeconds
    // ) {

    // }

    let origin = {
      x:
        diffCurrentMin > canvasWidth / 2
          ? (canvasWidth / 2 -
              ((currentValue - startValue) * divide) / precision) *
            2
          : (canvasWidth / 2 - diffCurrentMin) * 2,
      y: canvasHeight * 2,
    };

    heightDecimal = heightDecimal * 2;
    heightDigit = heightDigit * 2;
    lineWidth = lineWidth * 2;
    fontSize = fontSize * 2;
    fontMarginTop = fontMarginTop * 2;
    divide = divide * 2;
    const derivative = 1 / precision;

    let i = 0;

    for (
       i = currentValue < maxValue ? Math.round((startValue / precision) * 10) / 10 : endValue - 600;
      i <= endValue / precision;
      i++
    ) {
      context.beginPath();
      context.moveTo(origin.x + (i - startValue / precision) * divide, 0);
      context.lineTo(
        origin.x + (i - startValue / precision) * divide,
        i % 60 === 0 ? heightDecimal : heightDigit
      );
      context.lineWidth = lineWidth;
      context.strokeStyle = i % 10 === 0 ? colorDecimal : colorDigit;
      context.stroke();
      context.fillStyle = fontColor;
      context.textAlign = "center";
      context.textBaseline = "top";
      if (i % 60 === 0) {
        context.font = `${fontSize}px Arial`;
        context.fillText(
          Math.round((i /60)%60) / (derivative / 1) + ":00",
          origin.x + (i - startValue / precision) * divide,
          fontMarginTop
        );
      }

      context.closePath();
    }
  };
  //  d=new Date();
  //  n=d.getDate();
  handleValue = (value) => {  
    var d=new Date();
   var n=28;
   var m =2;
   var{month}=this.state;
    if (value) {
      let {
        startHours,
        startMinutes,
        startSeconds,
      } = this.state.startTimeDate;

      for (let i = 0; i < value; i++) {
        startHours = Math.floor(i / 3600)%24 ;
        startMinutes = Math.floor(i / 60) % 60;

        if (i % 60 === 0) {
          startSeconds = 1;
        }
      }
      if (startMinutes === 60) {
        startMinutes = 1;
      }

      this.setState({
        ...this.state,
        date:n,
        month:m,
        value,
        startTimeDate: {
          ...this.state.startTimeDate,
          startHours,
          startMinutes,
          startSeconds,

        },
      });
     
       
      // if(startHours===0 && startMinutes===0){
      //   this.setState({
      //     date:this.state.date+=1
      //   })
      // }
     
      for(var j=1;j<=12;j++){
        
        if(j===1||j===3||j===5||j===7||j===11){
          // console.log(this.state.date);
          
          if( this.state.date === 31 && startHours===0){
            this.state.date++
            this.setState({
              date:this.state.date=1,
              month:this.state.month+=1
            })
            // console.log(month);
            
          }
        }
        if(j===2){
          if(this.state.date===28 && startHours===0){
            this.state.date++
            this.setState({
              date:this.state.date=1,
              month:this.state.month+=1
            })
          }
        }
      }
      
    }
  };



  render() {
    const {  startTimeDate,date,month } = this.state;
    // console.log('startTimeDate', startTimeDate);
    

    return (
      <div className="box-canvas">
        <div className="show-value">
          <span>
            <b>
              Ngày:
              {`${date}`}/{month}
            </b>
          </span>
          <span className="time">
            <b>
              {`${startTimeDate.startHours}h ${startTimeDate.startMinutes}p ${startTimeDate.startSeconds}s`}
            </b>{" "}
     
          </span>
        </div>

        {/* <div className="endTime">
          <span>
            <b>
              Ngày:
              {`${startTimeDate.startDate}/${startTimeDate.startMonth}/${startTimeDate.startYear}`}{" "}
            </b>
          </span> 
           <span className="time">
            <b>
              {`${endTimeDate.endHours}h ${endTimeDate.endMinutes}p ${endTimeDate.endSeconds}s`}
            </b>{" "}
       setEndTimeDate = () => {
    const { date } = this.state;

    this.setState({
      ...this.state,
      endTimeDate: {
        endDate: date.getDate(),
        endMonth: date.getMonth() + 1,
        endYear: date.getFullYear(),
        // endHours: date.getHours(),
        endHours: 0,
        endMinutes: date.getMinutes(),
        endSeconds: date.getSeconds() + 1,
      },
    });
  };
          </span>
        </div> */}
        <canvas id="timeline" width="1920" height="30"></canvas>
      </div>
    );
  }
}

export default ruler;
