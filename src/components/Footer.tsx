import React from 'react'
import { Link } from '@fluentui/react-components'
import '../assets/style/Footer.css'

const Footer = () => (
  <div className="footer-container">
    {'© Bazinga the Dog 2025. '}
    <Link href="https://github.com/bazinga-thedog">Get in touch!</Link>
    {' -- Made with '}
    <span className="text-red">♥</span>
    {' by '}
    <Link href="https://github.com/bazinga-thedog/">
      Bazinga the Dog {'<@bazinga-thedog>'}
    </Link>
  </div>
)

export default Footer
