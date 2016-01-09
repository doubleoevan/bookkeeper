import React, {CSSProperties} from 'react';

/**
 * The Why page content
 */
export default function Why(): JSX.Element {
    return (
        <div
            className="metadata-why"
            style={styles.content}
        >
            Because we love you and you deserve to know how much...
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    content: {
        textAlign: 'center',
        paddingTop: '25vh'
    }
}
