import React, { useRef } from 'react';
import * as Diff2Html from 'diff2html';
import logo from './logo.svg';
import './App.css';

function App() {

  const divRef = useRef(null)


  function prepareRequest(url) {

    let fetchUrl;
    const githubCommitUrl =
      /^https?:\/\/(?:www\.)?github\.com\/(.*?)\/(.*?)\/commit\/(.*?)(?:\.diff)?(?:\.patch)?(?:\/.*)?$/;
    const githubPrUrl = /^https?:\/\/(?:www\.)?github\.com\/(.*?)\/(.*?)\/pull\/(.*?)(?:\.diff)?(?:\.patch)?(?:\/.*)?$/;


    function gitHubUrlGen(userName, projectName, type, value) {
      return 'https://api.github.com/repos/' + userName + '/' + projectName + '/' + type + '/' + value;
    }



    let values;
    if ((values = githubCommitUrl.exec(url))) {
      fetchUrl = gitHubUrlGen(values[1], values[2], 'commits', values[3]);
    } else if ((values = githubPrUrl.exec(url))) {
      fetchUrl = gitHubUrlGen(values[1], values[2], 'pulls', values[3]);
    } else {
      fetchUrl = url;
    }

    return fetchUrl
  }


  async function getDiff(request) {
    try {
      const headers = new Headers();
      headers.append('Accept', 'application/vnd.github.v3.diff');

      const result = await fetch(request, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
      });
      return result.text();
    } catch (error) {
      console.error('Failed to retrieve diff', error);
      throw error;
    }
  }




  const drawHtml = async () => {

    const gitURL = 'https://github.com/neojarvis-testing/49a86f9b-0884-4c83-a8a2-2164fa0d2f5f/commit/7afa255c3f2f39293888906e1759cb3fd6bb9c42'
    const requestURL = prepareRequest(gitURL)

    console.log('requestURL:::::', requestURL);

    const divHtml = divRef.current
    console.log('divHtml:::::', divHtml);
    
    const diffString = await getDiff(requestURL)
    console.log('diffString:::::', diffString);
    var configuration = {
      drawFileList: true,
      matching: 'lines'
    };
    var diff2htmlUi = new Diff2Html(divHtml, diffString, configuration);
        diff2htmlUi.draw();
        // diff2htmlUi.highlightCode();

  }


  return (
    <div>
      <button onClick={() => drawHtml()}>Get SanpShot</button>
      <div id='diffId' ref={divRef}> Div Text</div>
    </div>
  );
}

export default App;
