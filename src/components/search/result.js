import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useSearch } from '../../hooks'
import { Subheading, Paragraph } from '../typography'
import { Collapser } from '../collapser'
import { KnowledgeGraphs } from '../search'
import { VariablesList } from './study-variables-list'
import { dbGapLink } from '../../utils'
import { ExternalLink } from '../external-link'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    &:not(:last-child) {
        border-bottom: 1px solid var(--color-eggplant-light);
    }
`

// Name

const Name = styled(Subheading)`
    padding: 1rem;
    margin: 0;
`

// Details

const ResultParagraph = styled(Paragraph)`
    margin: 1rem;
`


const collapserStyles = {
    titleStyle: {
        backgroundColor: '#eee',
        borderWidth: '1px 0',
        borderStyle: 'solid',
        borderColor: 'var(--color-lightgrey)',
    },
    bodyStyle: {
        backgroundColor: '#ddd',
    },
}

const CollapserHeader = styled.div`
    display: flex;
    flex-direction: column;
    @media (min-width: 920px) {
        flex-direction: row;
    }
    justify-content: space-between;
    padding: 0.5rem 1rem;
`


const StudyName = styled.div``
const StudyAccession = styled.div``

export const Result = ({ result, query }) => {
    const { name, description, id, type } = result // other properties: type, search_terms, optional_terms
    const [knowledgeGraphs, setKnowledgeGraphs] = useState([])
    const { fetchKnowledgeGraphs } = useSearch()

    useEffect(() => {
        const getKgs = async () => {
            const kgs = await fetchKnowledgeGraphs(id, query)
            setKnowledgeGraphs(kgs)
        }
        getKgs()
    }, [])

    return (
        <Wrapper>
            <Name>Concept: { name }</Name>
            <ResultParagraph>
                <strong>ID</strong>: {id} <br></br>
                <strong>Type</strong>: { type } <br></br>
                <strong>Description</strong>: { description } <br></br>
            </ResultParagraph>
            {
                knowledgeGraphs.length > 0 && (
                    <Collapser key={ `${ name } kg` } ariaId={ `${ name } kg` } { ...collapserStyles } title={ <CollapserHeader>Knowledge Graph</CollapserHeader> }>
                        <KnowledgeGraphs graphs={ knowledgeGraphs } />
                    </Collapser>
                )
            }
        </Wrapper>
    )
}

Result.propTypes = {
    result: PropTypes.shape({
        id:PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,
        description:PropTypes.string.isRequired,
        type:PropTypes.string.isRequired,
        search_terms:PropTypes.array.isRequired,
        optional_terms:PropTypes.array.isRequired
    })
}

/*
Section I had to take out because variables didn't work
            {
                result.studies.map(({ study_id, study_name, variables }) => (
                    <Collapser key={ `${ name } ${ study_id }` } ariaId={ 'studies' } { ...collapserStyles }
                        title={
                            <CollapserHeader>
                                <StudyName>
                                    <strong>Study</strong>:
                                    <ExternalLink to={ dbGapLink.study(study_id.replace(/^TOPMED\.STUDY:/, '')) } >{ study_name }</ExternalLink>
                                </StudyName>
                                <StudyAccession>
                                    <strong>Accession</strong>: 
                                    <ExternalLink to={ dbGapLink.study(study_id.replace(/^TOPMED\.STUDY:/, '')) } >{ study_id.replace(/^TOPMED\.STUDY:/, '') }</ExternalLink>
                                </StudyAccession>
                            </CollapserHeader>
                        }
                    >
                        <VariablesList studyId={ study_id.replace(/^TOPMED\.STUDY:/, '') } variables={ variables } />
                    </Collapser>
                ))
            }
*/