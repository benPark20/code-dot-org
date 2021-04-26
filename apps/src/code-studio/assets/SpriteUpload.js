import React from 'react';

export default class SpriteUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileData: null,
      filePreviewURL: '',
      filename: '',
      category: ''
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state.fileData);
    let xhr = new XMLHttpRequest();

    const onError = function() {
      console.log(new Error(`${xhr.status} ${xhr.statusText}`));
    };

    const onSuccess = function() {
      if (xhr.status >= 400) {
        onError();
        return;
      }
    };

    xhr.addEventListener('load', onSuccess);
    xhr.addEventListener('error', onError);
    xhr.open(
      'POST',
      `/api/v1/animation-library/level_animations/${this.state.filename}`,
      true
    );
    xhr.setRequestHeader('Content-type', 'image/png');
    xhr.send(this.state.fileData);
  };

  handleImageChange = event => {
    let file = event.target.files[0];
    this.setState({
      fileData: file,
      filename: file.name,
      filePreviewURL: URL.createObjectURL(file)
    });
  };

  handleCategoryChange = event => {
    this.setState({
      category: event.target.value
    });
  };

  render() {
    return (
      <div>
        <h1>Sprite Upload</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            <h4> Sprite Category: </h4>
            <input
              type="text"
              value={this.state.category}
              onChange={this.handleCategoryChange}
            />
          </label>
          <label>
            <h4> Select Sprite to Add to Library: </h4>
            <input
              type="file"
              accept="image/png"
              ref="uploader"
              onChange={this.handleImageChange}
            />
          </label>
          <br />
          <label>
            <h4> Image Preview: </h4>
            <img src={this.state.filePreviewURL} />
          </label>
          <br />
          <button type="submit">Upload to Library</button>
        </form>
      </div>
    );
  }
}
