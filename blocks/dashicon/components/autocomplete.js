const { Autocomplete } = wp.components;

const MyDashIconsAutocomplete = () => {
    const autocompleters = [
        {
            name: 'dashicons',
            // The prefix that triggers this completer
            triggerPrefix: '',
            isDebounced: true,
            // The option data
            options: _dashiconsAutocompleteList,
            getOptionLabel: option => (
                <span>
                    <span className={"dashicons dashicons-" + option.id } ></span> { option.name }
                </span>
            ),
            // Declares that options should be matched by their name
            getOptionKeywords: option => [ option.name ],
            // Declares completions should be inserted as abbreviations
            getOptionCompletion: option => (
                option.id
            ),
            allowContext: ( before, after ) => {
                // display the autocomplete UI only when the cursor is at the end of the search.
                if ( '' !== after ) {
                    return false;
                }

                return true;
            }
        }
    ];

    return (
        <div>
            <Autocomplete completers={ autocompleters }>
                { ( { isExpanded, listBoxId, activeId } ) => (
                    <div
                        contentEditable
                        suppressContentEditableWarning
                        aria-autocomplete="list"
                        aria-expanded={ isExpanded }
                        aria-owns={ listBoxId }
                        aria-activedescendant={ activeId }
                    >
                    </div>
                ) }
            </Autocomplete>
        </div>
    );
};

export default MyDashIconsAutocomplete;