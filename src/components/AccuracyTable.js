import React from "react";
import Accuracy from "./Accuracy";

const AccuracyTable = () => (
  <table className="table">
    <thead>
      <tr>
        <th>数字</th>
        <th>精度</th>
      </tr>
    </thead>
    <tbody>
      <Accuracy no={0} content="-" />
      <Accuracy no={1} content="-" />
      <Accuracy no={2} content="-" />
      <Accuracy no={3} content="-" />
      <Accuracy no={4} content="-" />
      <Accuracy no={5} content="-" />
      <Accuracy no={6} content="-" />
      <Accuracy no={7} content="-" />
      <Accuracy no={8} content="-" />
      <Accuracy no={9} content="-" />
    </tbody>
  </table>
);

export default AccuracyTable;
