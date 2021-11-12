import React from 'react';
import {Table, Icon} from 'semantic-ui-react';

const RepoList = ( {repoList} ) => {

    const openGithubLink = (link) => {
        window.open(link, '_blank').focus();
    }

    const renderedList = repoList.map((repo) => {
        return(
            <Table.Row key={repo.id} textAlign='center' onClick={() => openGithubLink(repo.html_url)}>
                <Table.Cell>{repo.name}</Table.Cell>
                <Table.Cell>{`"${repo.default_branch}"`}</Table.Cell>
                <Table.Cell>
                    <Icon name='github' link={true}/>
                </Table.Cell>
            </Table.Row>
        );
    });

    return(
        <Table>
            <Table.Header>
                <Table.Row textAlign='center'>
                    <Table.HeaderCell colSpan='1'>Repositories</Table.HeaderCell>
                    <Table.HeaderCell colSpan='1'>Default Branch</Table.HeaderCell>
                    <Table.HeaderCell colSpan='1'>Github Link</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {renderedList}
            </Table.Body>
        </Table>
    );
};

export default RepoList;