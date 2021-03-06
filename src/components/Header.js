import React from 'react'
import headerLogo from './../assets/images/CWS-CARES-tempLogo.png'

const Header = () => {
  return (
    <div>
      <div>
        <div className="banner-customizable">
          <center>
            <img className="logo-customizable"
              src={headerLogo} alt='CWS-CARES-tempLogo'/>
          </center>
        </div>
      </div>
    </div>
  )
}

export default Header
