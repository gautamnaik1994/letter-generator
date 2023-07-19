import React from 'react';
import SampleTemplate from '../template/offer-letter.json';
import { useLocation } from 'react-router-dom';
import Editor from '../components/Editor';

let htmlString = SampleTemplate['html'];

export default function Home() {
  const { state } = useLocation();

  if (state) {
    htmlString = state.html;
  }

  return <Editor htmlString={htmlString} />;
}
