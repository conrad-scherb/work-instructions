import React from 'react';
import "./styles/tailwind.output.css"

class RoleSelector extends React.Component<any, any> {
  render() {
    return(
    <form>
      <table className="table-fixed">
        <tr>
          <td className="w-1/2 text-left">
            <input type="radio" id ="ak" name="role" value="ak"/>
            <label htmlFor="ak"> Auckland</label>
          </td>

          <td className="text-left">
            <input type="radio" id ="om" name="role" value="om"/>
            <label htmlFor="om"> Operations Manager</label>
          </td>
        </tr>

        <tr>
          <td className="text-left">
            <input type="radio" id ="wlg" name="role" value="wlg"/>
            <label htmlFor="wlg"> Wellington</label>
          </td>

          <td className="text-left">
            <input type="radio" id ="pm" name="role" value="pm"/>
            <label htmlFor="pm"> Production Manager</label>
          </td>
        </tr>
      
        <tr>
          <td className="text-left">
            <input type="radio" id ="rot" name="role" value="rot"/>
            <label htmlFor="rot"> Rotorua</label>
          </td>

          <td className="text-left">
            <input type="radio" id ="pa" name="role" value="pa"/>
            <label htmlFor="pa"> Production Assistant</label>
          </td>
        </tr>
      </table>

      <div className="pt-4">
        <input className="bg-blue-300 px-2 rounded-full" type="submit" value="Get instructions" />
      </div>
    </form>
    )
  }
}

export default RoleSelector