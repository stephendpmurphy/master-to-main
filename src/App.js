import React, {useState, useEffect} from 'react';
import {Container, Header, Search, Message, Loader, Segment} from 'semantic-ui-react';
import axios from 'axios';
import RepoList from './components/RepoList';

const App = () => {

  const [user, setUser] = useState("");
  const [repos, setRepos] = useState([]);
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    // If user is emtpy. Just set the repos list blank and return
    if( user === "" ) {
      setRepos([]);
      setSearching(false);
      return;
    }

    const getRepos = async() => {
      try {
        // Retrieve the first page of repos
        const {data} = await axios.get(`https://api.github.com/users/${user}/repos`);

        // If there are more, retreive the next page

        // Filter through and only grab repos with master as the default branch
        // and if it's NOT a fork.  (We only want to show repos that the user can do something about)
        var filteredRepos = [];
        data.forEach((i) => {
          if( (i.default_branch === 'master') && (!i.fork) )
          filteredRepos.push(i);
        })

        setSearching(false);
        setRepos(filteredRepos);
      }
      catch(err) {
        // Error occured fetching repos. Clear the list.
        setRepos([]);
        setSearching(false);
      }
    };

    // Debounce our API request. No typing must occur for X time before
    // we retrieve the repos
    const timeout = setTimeout(() => {
      getRepos();
    }, 500);

    setSearching(true);

    // At the next re-render, clear our timeout thus clearing the debounce.
    return () => {
      clearTimeout(timeout);
    }
  }, [user]);

  const buildTableView = () => {
    var jsx = "";

    // { repos.length ? <RepoList repoList={repos}></RepoList> : (user === '' ? null : <Header textAlign="center" style={{marginTop:'2rem'}}>No user found.</Header>)}
    if( searching ) {
      console.log("searching..");
      jsx = <Segment textAlign='center'><Loader active inline centered>Searching...</Loader></Segment>
    }
    else if( (user !== "") && (repos.length) ) {
      jsx = <RepoList repoList={repos}></RepoList>;
    }
    else if( (user !== "") && (!repos.length) ) {
      jsx = <Segment textAlign='center'><Header.Subheader>No user or org found.</Header.Subheader></Segment>
    }
    else {
      jsx = <Segment textAlign='center'><Header.Subheader>Type a Github user or org name to begin.</Header.Subheader></Segment>
    }


    return jsx;
  }

  return(
      <Container style={{height:'100vh', paddingTop:'10vh'}}>
        <Header textAlign='center' as='h2' content='Master to Main' subheader="Check if a Github user or org has any public repositories with the default branch set as 'master'"/>
        <Search
          size='big'
          input={{fluid:true}}
          showNoResults={false}
          onSearchChange={(e) => setUser(e.target.value)}
          placeholder='Search Github users'
        />
        <Message>
          <Message.Header>Helpful links</Message.Header>
          <Message.List>
          <Message.Item>
            <a href="https://betterprogramming.pub/github-replacing-master-with-main-is-a-huge-win-for-inclusion-in-tech-bf517478275b" target="_blank" rel="noreferrer">Inclusivity - The idea behind renaming your "master" branch</a>
          </Message.Item>
          <Message.Item>
            <a href="https://github.com/github/renaming#renaming-existing-branches" target="_blank" rel="noreferrer">Renaming existing branches on Github</a>
          </Message.Item>
          <Message.Item>
            <a href="https://github.com/stephendpmurphy/master-to-main" target="_blank" rel="noreferrer">Contribute to this project on Github</a>
          </Message.Item>
          </Message.List>
        </Message>
        {buildTableView()}
      </Container>
  );
}

export default App;
