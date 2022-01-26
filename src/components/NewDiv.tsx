import React from "react";
import "../components/NewDiv.css";

interface IDiv {
  beginX?: number;
  beginY?: number;
  endX?: number;
  endY?: number;
  width?: number;
  height?: number;
  moveFlag?: boolean;
  pos?: number;
  changeSize?: boolean;
}

interface IFieldProps {}

interface IFieldState {
  tempArrActive: IDiv[];
  arrayActive: IDiv[];
  array: IDiv[];
  current?: IDiv;
  isClicked?: boolean;
  isSet?: boolean;
  isMouseDown?: boolean;
  rows: number;
  columns: number;
  cellArray: IDiv[];
  pos: number;
  downActive: boolean;
  selectedDiv: boolean;
}

let pressedMouse = 0;

export default class Field extends React.Component<IFieldProps, IFieldState> {
  constructor(props: IFieldProps) {
    super(props);
    this.state = {
      isClicked: false,
      isSet: false,
      isMouseDown: false,
      array: [],
      arrayActive: [],
      tempArrActive: [],
      rows: 0,
      columns: 0,
      cellArray: [],
      pos: -1,
      current: {
        beginX: 0,
        beginY: 0,
        endX: 0,
        endY: 0,
        width: 0,
        height: 0,
      },
      downActive: false,
      selectedDiv: false,
    };
  }

  mouseDown(e: React.MouseEvent) {
    this.setState({ isClicked: true }); //маркер чтобы рисовался current
    //опускаем мышку на поле без дивов
    this.setState({ isClicked: true });
    if (this.state.selectedDiv === false) {
      console.log("srab");
      console.log(e.target as HTMLDivElement);
      this.setState({
        //устанавливаем флаги и значение каррент по координатам
        isClicked: true,
        isSet: true,
        isMouseDown: true,
        current: {
          beginX: e.pageX,
          beginY: e.pageY,
        },
      });
    }
  }

  mouseUp(e: any) {
    this.setState({
      current: {
        beginX: e.pageX,
        beginY: e.pageY,
        endX: 0,
        endY: 0,
        width: 0,
        height: 0,
      },
      isClicked: false,
    });
  }

  mouseMove(e: any) {
    if (this.state.isClicked === true) {
      this.setState({
        //обнуление currnt дива
        current: {
          beginX: e.pageX,
          beginY: e.pageY,
          width: 0,
          height: 0,
          endX: 0,
          endY: 0,
        },
      });
      if (this.state.isClicked === true) {
        //рисование currnt дива
        this.setState({
          current: {
            beginX: this.state.current?.beginX,
            beginY: this.state.current?.beginY,
            endX: e.pageX,
            endY: e.pageY,
            width: Math.abs(e.pageX - this.state.current?.beginX!),
            height: Math.abs(e.pageY - this.state.current?.beginY!),
          },
        });
        if (
          //выделение ячеек
          (e.target as HTMLDivElement).classList.contains("cell")
        ) {
          for (
            let i = this.state.current?.beginX;
            i! <= this.state.current?.endX!;
            i!++
          ) {
            for (
              let j = this.state.current?.beginY;
              j! <= this.state.current?.endY!;
              j!++
            ) {
              let elem = document.elementFromPoint(i!, j! -85!); //выделение ячеек
              if (
                elem?.classList.contains("field")
              ) {
              } else {
                elem?.classList.add("underline");
              }
            }
          }
        }
      }
    }
  }

  render() {
    let rows = []; //создание ячеек
    for (let i = 0; i < 5; i++) {
      let rowID = `row ${i}`;
      let cell = [];
      let input = [];
      for (let idx = 0; idx < 5; idx++) {
        let cellID = `cell ${i}-${idx}`;
        cell.push(<td key={cellID} className={cellID} id={cellID}></td>);
        input.push(<input key={cellID} className={cellID} id={cellID} />);
      }
      rows.push(
        <tr key={i} id={rowID}>
          {input}
        </tr>
      );
    }
    return (
      <>
        <div className="NewDiv">
          <header className="App-header">
            <p>Зажмите левую кнопку мыши</p>
          </header>
          <div
            className="field"
            onMouseDown={this.mouseDown.bind(this)}
            onMouseUp={this.mouseUp.bind(this)}
            onMouseMove={this.mouseMove.bind(this)}
          >
            <div className="container">
              <div className="row">
                <div className="col s12 board">
                  <table className="simple-board">
                    <tbody>{rows}</tbody>
                  </table>
                </div>
              </div>
            </div>
            {
              <div
                className="div-selected1"
                style={{
                  top:
                    (this.state.current!.endY || 0) >
                    (this.state.current!.beginY || 0)
                      ? this.state.current!.beginY
                      : this.state.current!.endY,
                  left:
                    (this.state.current!.endX || 0) >
                    (this.state.current!.beginX || 0)
                      ? this.state.current!.beginX
                      : this.state.current!.endX,
                  width: this.state.current!.width,
                  height: this.state.current!.height,
                }}
              ></div>
            }
          </div>
        </div>
      </>
    );
  }
}
