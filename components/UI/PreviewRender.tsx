import React from "react";

function PreviewRender({ source, alt , width , height}) {
  // Verifications
  const isVideo = (source) => {
    return source.includes("mp4");
  };
  const isImage = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };
  // check if string is youtube url
  const isYoutube = (url) => {
    return url.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/) != null;
  };

  // get youtube video id
  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

  if (isVideo(source[0])) {
    return <video src={source} loop muted controls style={{ width: width, height: height }}></video>;
  } else if (isImage(source[0])) {
    return <img src={source} alt={alt} style={{ width: width, height: height }} />;
  }
  // if youtube url
  else if (isYoutube(source[0])) {
    return (
      <iframe
        title="youtube"
        src={`https://www.youtube.com/embed/${youtube_parser(source[0])}`}
        frameBorder="0"
        allow=""
        allowFullScreen
        style={{ width: width, height: height }}
      ></iframe>
    );
  } else {
    return <img src={"/img/imgnotfound.png"} alt={alt} style={{ width: width, height: height }} />;
  }
}

export default PreviewRender;
