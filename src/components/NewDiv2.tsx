import React from "react";
import "../components/NewDiv.css";

interface IDiv {
  beginX?: number;
  beginY?: number;
  endX?: number;
  endY?: number;
  width?: number;
  height?: number;
}

interface IFieldProps { }

interface IFieldState {
  array: IDiv[];
  current?: IDiv;
  isClicked?: boolean;
  rows: number;
  columns: number;
  pos?: number,
  moveFlag: boolean,

  test: IDiv[]
}

export default class Field extends React.Component<IFieldProps, IFieldState> {
  constructor(props: IFieldProps) {
    super(props);
    this.state = {
      isClicked: false,
      array: [],
      moveFlag: false,

      test: [],
      rows: 0,
      columns: 0,
    };
  }

  handleChangeRows(e: any) {
    this.setState({ rows: e.target.value });
  }

  handleChangeColumns(e: any) {
    this.setState({ columns: e.target.value });
  }

  mouseDown = (e: any) => {
    if (!(e.target as HTMLDivElement).classList.contains("div-selected") && !this.state.moveFlag && !this.state.isClicked) {
      this.setState({
        isClicked: true,
        current: {
          beginX: e.pageX,
          beginY: e.pageY,
        },
      })
    }

    this.mouseMove(e);
  }

  mouseUp = (e: any) => {
    this.setState({
      isClicked: false,
      array: [
        ...this.state.array,
        {
          beginX: this.state.current?.beginX,
          beginY: this.state.current?.beginY,
          endX: e.pageX,
          endY: e.pageY,
          width: Math.abs(e.pageX - this.state.current!.beginX!),
          height: Math.abs(e.pageY - this.state.current!.beginY!),
        },
      ],
      test: []
    })

    this.onDivUp();
  }

  mouseMove = (e: any) => {

    if (this.state.moveFlag && !this.state.isClicked) {
      let myPos = this.state.pos;
      let temp = [...this.state.array]


      this.state.array.map((item, pos) => {
        if (myPos === pos) {
          temp[pos] = {
            beginX: e.pageX,
            beginY: e.pageY,
            endX: Math.abs(e.pageX - temp[pos].width!),
            endY: Math.abs(e.pageY - temp[pos].height!),
            width: temp[pos].width,
            height: temp[pos].height,
          }
        }
      })

      this.setState({
        array: temp
      })
    }

    if (!this.state.moveFlag && this.state.isClicked) {

      this.setState({
        test: [
          {
            beginX: this.state.current?.beginX,
            beginY: this.state.current?.beginY,
            endX: e.pageX,
            endY: e.pageY,
            width: Math.abs(e.pageX - this.state.current!.beginX!),
            height: Math.abs(e.pageY - this.state.current!.beginY!),
          },
        ]
      })


      if (
        e.target.classList.contains("cell")
      ) {
        for (
          let i = this.state.current?.beginX;
          i! <= e.pageX;
          i!++
        ) {
          for (
            let j = this.state.current?.beginY;
            j! <= e.pageY;
            j!++
          ) {
            let elem = document.elementFromPoint(i! + 10, j! + 10); //выделение ячеек
            if (
              elem?.classList.contains("cell")
            ) {elem?.classList.add("underline");
            } 
          }
        }
    }
  }
  }

  onDivDown = (e: any, pos: number) => {
    this.setState({
      pos: pos,
      moveFlag: true
    })
  }

  onDivUp = () => {
    this.setState({
      moveFlag: false
    })
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
            <p>Div для рисования divов</p>
          </header>
          <div
            className="field"
            onMouseDown={(e) => this.mouseDown(e)}
            onMouseMove={(e) => this.mouseMove(e)}
          >
            {this.state.array.map((item, pos) => {
              return (
                <div
                  className="div-selected"
                  style={{
                    top:
                      (item.endY || 0) > (item.beginY || 0)
                        ? item.beginY
                        : item.endY,
                    left:
                      (item.endX || 0) > (item.beginX || 0)
                        ? item.beginX
                        : item.endX,
                    width: item.width,
                    height: item.height,
                  }}
                  onMouseDown={(e) => this.onDivDown(e, pos)}
                  onMouseUp={() => this.onDivUp()}
                  key={pos + 1}
                >
                </div>
              )
            }
            )}
          </div>

          <div
            className="area"
            onMouseUp={(e) => this.mouseUp(e)}
            onMouseMove={(e) => this.mouseMove(e)}
          >
            {this.state.test.map((item, pos) => {
              return (
                <div
                  className="div-selected"
                  style={{
                    top:
                      (item.endY || 0) > (item.beginY || 0)
                        ? item.beginY
                        : item.endY,
                    left:
                      (item.endX || 0) > (item.beginX || 0)
                        ? item.beginX
                        : item.endX,
                    width: item.width,
                    height: item.height,
                  }}
                  key={pos + 1}
                >
                </div>
              )
            }
            )}
            <p className="text">Введите количество строк:</p>
            <input
              onChange={this.handleChangeRows.bind(this)}
              value={this.state.rows}
              className="input"
            />
            <p className="text">Введите количество столбцов:</p>
            <input
              onChange={this.handleChangeColumns.bind(this)}
              value={this.state.columns}
              className="input"
            />
          </div>
          <div className="container">
              <div className="row">
                <div className="col s12 board">
                  <table className="simple-board">
                    <tbody>{rows}</tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
      </>
    );
  }

}
