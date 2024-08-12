import React from 'react';
import './FileList.css';

const FileList = ({ files }) => {
  return (
    <div className="file-list">
      <h2>All documents</h2>
      <p>Overview of every files or documents that you have stored.</p>
      <table>
        <thead>
          <tr>
            <th>File name</th>
            <th>Date uploaded</th>
            <th>Last updated</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.name}</td>
              <td>{file.dateUploaded}</td>
              <td>{file.lastUpdated}</td>
              <td>{file.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;