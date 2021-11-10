import React from 'react';
import {Container, Grid} from 'semantic-ui-react';
import SearchBar from './components/SearchBar';

const App = () => {
    return(
        <Container>
          <Grid stretched='true' style={{height:'100vh'}}>
            <Grid.Column verticalAlign='middle' stretched='true'>
              <SearchBar/>
            </Grid.Column>
          </Grid>
        </Container>
    );
}

export default App;
