import React, {useState, useEffect} from 'react';
import {Container, Grid, Header, Search} from 'semantic-ui-react';
import axios from 'axios';
import RepoList from './components/RepoList';

const App = () => {

  const [user, setUser] = useState("");
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if( user === "" ) {
      setRepos([]);
      return;
    }

    const getRepos = async() => {
      try {
        // Retrieve the first page of repos
        const {data} = await axios.get(`https://api.github.com/users/${user}/repos`);
        // console.log(data);

        // If there are more, retreive the next page


        const badRepos = [];
        data.forEach((i) => {
          if( (i.default_branch === 'master') && (!i.fork) )
            badRepos.push(i);
        })

        console.log(badRepos);
        setRepos(badRepos);

      }
      catch(err) {
        setRepos([]);
      }
    };

    const timeout = setTimeout(() => {
      getRepos();
    }, 500);

    return () => {
      clearTimeout(timeout);
    }

  }, [user]);

  return(
      <Container>
        <Grid stretched={true} style={{position:'absolute', top:'50%', left:'50%', width:'75vh', marginTop:'-15%', marginLeft:'-25%'}}>
          <Grid.Column textAlign='center' verticalAlign='middle' stretched={true}>
            <Header as='h2' content='Master to Main' subheader="Check if you have any public Github repositories with the default branch set as 'master'"/>
            <Search
              size='big'
              input={{fluid:true}}
              showNoResults={false}
              onSearchChange={(e) => setUser(e.target.value)}
            />
            { repos.length ? <RepoList repoList={repos}></RepoList> : (user === '' ? null : <Header.Subheader style={{marginTop:'2rem'}}>No user found.</Header.Subheader>)}
          </Grid.Column>
        </Grid>
      </Container>
  );
}

export default App;
