import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

class RichTextbox extends React.Component<any, any> {
    constructor(props: any) {
      super(props);

      this.handleChange = this.handleChange.bind(this)
    }

    handleChange(content: any){
      this.props.handleTextEdit(content, this.props.index)
    }
  
    render() {
        return (
          <SunEditor 
            onChange={this.handleChange}
            setContents={this.props.contents}
            setDefaultStyle="font-size: 12px;"
            setOptions={{
              height: 150,
              buttonList: [['font', 'fontSize', 'bold', 'underline', 'italic', 'strike'], ['align', 'fontColor', 'list', 'image', 'table'], ['codeView','save']]
            }}
          />
      )
    }
  }

export default RichTextbox