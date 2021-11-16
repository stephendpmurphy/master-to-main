import React, {useState, useEffect} from 'react';
import {Container, Header, Search, Message, Loader, Segment, Checkbox} from 'semantic-ui-react';
import axios from 'axios';
import RepoList from './components/RepoList';

const App = () => {

  const [user, setUser] = useState("");
  const [repos, setRepos] = useState([]);
  const [searching, setSearching] = useState(false);
  const [filterForked, setFilterForked] = useState(true);
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    // If user is emtpy. Just set the repos list blank and return
    if( user === "" ) {
      setRepos([]);
      setSearching(false);
      setResultText("Type a Github user or org name to begin.");
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
          // Check if the repo default branch is master
          if( (i.default_branch === 'master') ) {
            // iF we aren't filtering forks.. Then just add the repo to the list
            if( !filterForked ) {
              filteredRepos.push(i);
            }
            else if( (!i.fork && filterForked) ) {
              // We are filtering forked repos and this one isnt a fork.. Add it to the list.
              filteredRepos.push(i);
            }
          }
        })

        // Clear our searching state and set the repos list state
        setSearching(false);
        setRepos(filteredRepos);

        if( !filteredRepos.length ) {
          setResultText("No repos found with a 'master' default branch  🎉");
        }
      }
      catch(err) {
        // Error occured fetching repos. Clear the list.
        setRepos([]);
        setSearching(false);
        setResultText("No user or org found with that name.");
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
  }, [user, filterForked]);

  const buildTableView = () => {
    var jsx = "";

    if( searching ) {
      jsx = <Segment textAlign='center'><Loader active inline>Searching...</Loader></Segment>
    }
    else if( (user !== "") && (repos.length) ) {
      jsx = <RepoList repoList={repos}></RepoList>;
    }
    else {
      jsx = <Segment textAlign='center'><Header.Subheader>{resultText}</Header.Subheader></Segment>
    }

    return jsx;
  }

  const buildHelpfulLinks = () => {
    return(<Message>
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
                </Message>)
  }

  return(
      <Container style={{height:'100vh', paddingTop:'10vh'}}>
        <Header textAlign='center' as='h2' content='Master to Main' subheader="Check if a Github user or org has any public repositories with the default branch set as 'master'"/>
        {buildHelpfulLinks()}
        <Search
          size='big'
          input={{fluid:true}}
          showNoResults={false}
          onSearchChange={(e) => setUser(e.target.value)}
          placeholder='Search Github users'
        />
        <Container textAlign='center' style={{margin:'1rem'}}>
          <Checkbox
            toggle
            label={{children:"Filter out Forked repos"}}
            onChange={(evt, data) => {setFilterForked(data.checked)}}
            defaultChecked
          />
        </Container>
        {buildTableView()}
      </Container>
  );
}

export default App;
