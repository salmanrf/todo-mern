const Hamburger = props => {
  return (
    <div className="hamburger-menu" onClick={props.onClick}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Hamburger