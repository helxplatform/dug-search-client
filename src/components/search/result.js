import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useSearch } from '../../hooks'
import { Subheading, Paragraph } from '../typography'
import { Collapser } from '../collapser'
import { KnowledgeGraphs } from '../search'
import { VariablesList } from './study-variables-list'
import { ExternalLink } from '../external-link'
import { Tabs, Tab} from 'react-bootstrap';

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

const ConceptType = styled(Paragraph)`
    margin: 1rem;
`

const ConceptDescription = styled(Paragraph)`
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
    const { name, description, id, type, concept_action } = result // other properties: type, search_terms, optional_terms
    const [knowledgeGraphs, setKnowledgeGraphs] = useState([])
    const [variableResults, setVariableResults] = useState([])
    const { fetchKnowledgeGraphs } = useSearch()
    const { fetchVariableResults } = useSearch()

    useEffect(() => {
        const getKgs = async () => {
            const kgs = await fetchKnowledgeGraphs(id, query)
            setKnowledgeGraphs(kgs)
        }
        getKgs()
        const getVars = async () => {
            const res = await fetchVariableResults(id, query)
            setVariableResults(res)
        }
        getVars()
    }, [])



    return (
        <Wrapper>
            { !concept_action=="" ? (
                <Name>Concept: <ExternalLink to={concept_action} >{name}</ExternalLink></Name>
            ): (
                <Name>Concept: {name}</Name>
            )}
            { 
                <ResultParagraph>
                    {type !== "" ? (
                        <ConceptType>
                            <strong>Type</strong>: { type } <br></br>
                        </ConceptType>
                    ) : (
                        <ConceptType>
                            <strong>Type</strong>: Untyped <br></br>
                        </ConceptType>
                    )}
                    {description !== "" ? (
                        <ConceptDescription>
                            <strong>Description</strong>: { description } <br></br>
                        </ConceptDescription>
                    ) : (
                        <ConceptDescription>
                            <strong>Description</strong>: No description for this concept. <br></br>
                        </ConceptDescription>
                    )}
                </ResultParagraph>
            }
            {
                Object.keys(variableResults).length === 1 ? ( variableResults[Object.keys(variableResults)[0]].map(({ c_id, c_name, elements, c_link }) =>(
                    <Collapser key={`${name} ${c_id}`} ariaId={'studies'} {...collapserStyles}
                        title={
                            <CollapserHeader>
                                <StudyName>
                                    <strong>Study</strong>:
                                    <ExternalLink to={c_link} >{c_name}</ExternalLink>
                                </StudyName>
                                <StudyAccession>
                                    <strong>Accession</strong>:
                                    <ExternalLink to={c_link} >{c_id.replace(/^TOPMED\.STUDY:/, '')}</ExternalLink>
                                </StudyAccession>
                            </CollapserHeader>
                        }
                    >
                        <VariablesList studyId={c_id.replace(/^TOPMED\.STUDY:/, '')} elements={elements} />
                    </Collapser>
                ))) : (
                        <Tabs defaultActiveKey={Object.keys(variableResults)[0]} id="uncontrolled-tab-example" tabWidth={2} paneWidth={5} position="left">
                            {
                                Object.keys(variableResults).map(v => (
                                    <Tab eventKey={v} title={v.replace('_', ' ')}>
                                        {
                                            variableResults[v].map(({ c_id, c_name, elements, c_link }) => (
                                                    <Collapser key={`${name} ${c_id}`} ariaId={'studies'} {...collapserStyles}
                                                        title={
                                                            <CollapserHeader>
                                                                <StudyName>
                                                                    <strong>Study</strong>:
                                                                    <ExternalLink to={c_link} >{c_name}</ExternalLink>
                                                                </StudyName>
                                                                <StudyAccession>
                                                                    <strong>Accession</strong>:
                                                                    <ExternalLink to={c_link} >{c_id.replace(/^TOPMED\.STUDY:/, '')}</ExternalLink>
                                                                </StudyAccession>
                                                            </CollapserHeader>
                                                        }
                                                    >
                                                        <VariablesList studyId={c_id.replace(/^TOPMED\.STUDY:/, '')} elements={elements} />
                                                    </Collapser>
                                            ))
                                        }
                                    </Tab>
                                ))
                            }
                        </Tabs>
                )
            }
            {
                knowledgeGraphs.length > 0 && (
                    <Collapser key={`${name} kg`} ariaId={`${name} kg`} {...collapserStyles} title={<CollapserHeader>Knowledge Graph</CollapserHeader>}>
                        <KnowledgeGraphs graphs={knowledgeGraphs} />
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
        optional_terms:PropTypes.array.isRequired,
        concept_action:PropTypes.array.isRequired
    })
}