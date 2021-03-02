import React from 'react'
import styled from 'styled-components'
import { dbGapLink } from '../../utils'

const Wrapper = styled.div`
    flex-direction: column;
    max-height: 12rem;
    margin: 0.5rem 0;
    overflow-y: auto;
    padding: 1rem;
`

const VariableLink = styled.a.attrs(props => ({ target: '_blank', rel: 'noopener noreferrer', href: props.to }))`
    display: block;
    padding: 0.5rem 0;
`

const List = styled.ul`
    padding: 0 1rem;
`

const ListItem = styled.li``

export const VariablesList = ({ studyId, elements }) => {
    return (
        <Wrapper>
            <strong>Variables</strong>
            <List>
                {
                    elements.map(element => (
                        <ListItem key={element.id }>
                            <VariableLink to={element.e_link || null}>{element.name.concat(": ").concat(element.description) }</VariableLink>
                        </ListItem>
                    ))
                }
            </List>
        </Wrapper>
    )
}
