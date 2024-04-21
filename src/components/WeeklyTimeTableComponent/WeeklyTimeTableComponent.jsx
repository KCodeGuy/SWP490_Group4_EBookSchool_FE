import React from "react";
import "./style.scss";
import { Subject } from "@mui/icons-material";

export default function WeeklyTimeTableComponent() {
  const weektableTable = [
    {
      id: 1,
      date: "10/4",
      slot: 1,
      subject: "Toan",
      teacher: "KhoaTD",
      class: "10A1",
      time: "10h-11h",
    },
    {
      id: 2,
      date: "10/4",
      slot: 2,
      subject: "Toan",
      teacher: "KhoaTD",
      class: "10A1",
      time: "10h-11h",
    },
    {
      id: 3,
      date: "10/4",
      slot: 3,
      subject: "Toan",
      teacher: "KhoaTD",
      class: "10A1",
      time: "10h-11h",
    },
    {
      id: 4,
      date: "12/4",
      slot: 2,
      subject: "Toan",
      teacher: "KhoaTD",
      class: "10A1",
      time: "10h-11h",
    },
    {
      id: 5,
      date: "12/4",
      slot: 5,
      subject: "Toan",
      teacher: "KhoaTD",
      class: "10A1",
      time: "10h-11h",
    },
    {
      id: 6,
      date: "17/4",
      slot: 3,
      subject: "Toan",
      teacher: "KhoaTD",
      class: "10A1",
      time: "10h-11h",
    },
  ];
  return (
    <table>
      <thead>
        <tr>
          <th rowSpan={2}>Buổi</th>
          <th rowSpan={2}>Tiết</th>
          <th>Thứ 2</th>
          <th>Thứ 3</th>
          <th>Thứ 4</th>
          <th>Thứ 5</th>
          <th>Thứ 6</th>
          <th>Thứ 7</th>
          <th>Chủ nhật</th>
        </tr>
        <tr>
          <th>10/4</th>
          <th>11/4</th>
          <th>12/4</th>
          <th>13/4</th>
          <th>14/4</th>
          <th>15/4</th>
          <th>16/4</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Sáng</td>
          <td>Slot 1</td>
        </tr>
      </tbody>
    </table>
  );
}
