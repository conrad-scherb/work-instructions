import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

class RichTextbox extends React.Component<any, any> {
    /*constructor(props: any) {
      super(props);
    }*/

    handleChange(content: any){
        console.log(content); //Get Content Inside Editor
    }
  
    render() {
        return (
            <div className="text-left">
              <SunEditor 
                onChange={this.handleChange}
                setOptions={{
				    height: 200,
					buttonList: [['font', 'bold', 'underline', 'italic', 'strike'], ['align', 'fontColor', 'list', 'image'], ['codeView','save']] // Or Array of button list, eg. [['font', 'align'], ['image']]
					// Other option
                }}
                />
            </div>
          );
    }
  }

export default RichTextbox