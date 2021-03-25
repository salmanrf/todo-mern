/* eslint-disable */
import {useState, useContext, useEffect} from "react";
import {Link, NavLink, Route, useRouteMatch, Switch} from "react-router-dom";
import {MdKeyboardArrowRight} from "react-icons/md";
import {CgAddR} from "react-icons/cg";

import {UserContext, TokenContext} from "../context_store";
import {postNewCollection, getCollectionsAll} from "../helper/todo_api";

import Hamburger from "../components/hamburger_menu";
import TodoBoard from "../components/todo_board";

const Dashboard = () => {
  const {path, url} = useRouteMatch();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Header toggleSidebar={() => setShowSidebar(!showSidebar)}/>
      <main>
        <Sidebar showSidebar={showSidebar}/>
        <Switch>
          <Route path={`${path}/:collection`}>
            <TodoBoard />
          </Route>
          <Route exact path={`${url}/`}>
            <TodoBoard />
          </Route>
        </Switch>
      </main>
    </>
  );
}

const Header = (props) => {
  const {user} = useContext(UserContext);

  return (
    <header className="header">
      <Hamburger onClick={props.toggleSidebar}/>
      {user ?
        <div className="user-action">
          <span>{user.username}</span>
          <div className="user-links">
            <Link to="/signout">Signout</Link>
          </div>
        </div> 
        :
        <div className="user-action">
          <Link to="/signin">Signin</Link>
        </div>
      }
    </header>
  )
}

const Sidebar = (props) => {
  let {path} = useRouteMatch();
  
  return (
    <div className="sidebar" style={{left: props.showSidebar ? "0" : "-100%"}}>
      <NavLink exact to={`${path}/`} className="sidebar-item" activeClassName="sidebar-active">All</NavLink>
      <NavLink to={`${path}/today`} className="sidebar-item" activeClassName="sidebar-active">Today</NavLink>
      <NavLink to={`${path}/upcoming`} className="sidebar-item" activeClassName="sidebar-active">Upcoming</NavLink>
      <CollectionList />  
    </div>
  );
}

const CollectionList = () => {
  const {path} = useRouteMatch();
  const token = useContext(TokenContext);
  const [collections, setCollections] = useState([]);
  const [showList, setShowList] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getCollectionsAll(token)
      .then((res) => {
        if(res.status === 200) 
          return res.json();
      })
      .then(({todo_collections}) => {
        setCollections(todo_collections);
      })
  }, []);

  return (
    <div className="collection-list-container">
      <div className="collection-list-title" onClick={() => setShowList(!showList)}>
        <span>Collections</span>
        <MdKeyboardArrowRight style={{transform: showList ? "rotate(90deg)" : "rotate(0deg)"}} />
      </div>
      <div className="collection-list" style={{height: showList ? `${(collections.length + 2) * 40}px` : "0"}}>
        {collections.map((c) => (
          <NavLink key={c._id} to={`${path}/${c._id}`} className="collection-link" activeClassName="sidebar-active">
            <div>{c.name}</div>
          </NavLink>
        ))
        }
        <div className="new-collection" onClick={() => setShowForm(true)}>
          <CgAddR />
          <span>Add Collection</span>
        </div>
        {showForm &&
          <>
            <div className="overlay" onClick={() => setShowForm(false)}></div>
            <CollectionForm toggleForm={setShowForm} collections={collections} updateCollections={setCollections}/>
          </>
        }
      </div>
    </div>
  );
}

const CollectionForm = (props) => {
  const token = useContext(TokenContext);
  const [name, setName] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await postNewCollection(name, token);

    if(response && response.status === 201) {
      const newCollection = await response.json();

      props.updateCollections([...props.collections, newCollection]);  
    }
    props.toggleForm(false);
  }
  
  return (
    <div className="collection-form">
      <div className="collection-form-header">Create Collection</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Collection Name</label>
        <input 
          type="text" 
          name="name" 
          placeholder="Collection name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="submit-collection">Submit</button>
      </form>
    </div>
  );
}

export default Dashboard;

