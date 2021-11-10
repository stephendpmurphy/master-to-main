import React from 'react';
import { Grid, Search } from 'semantic-ui-react';

const SearchBar = () => {


    return(
        <Grid textAlign='center'>
            <Grid.Column>
                <p>Username</p>
            </Grid.Column>
            <Grid.Column>
                <Search/>
            </Grid.Column>
        </Grid>
    );
};

export default SearchBar;