import React from 'react'
import headerLogo from './../assets/images/CWS-CARES-tempLogo.png'

const Header = () => {
  return (
    <div>
      <div>
        <div className="banner-customizable">
          <center>
            <img
              className="logo-customizable"
              alt='CWS-CARES logo'
              src={headerLogo}/>
          </center>
        </div>
      </div>
    </div>
  )
}

export default Header
