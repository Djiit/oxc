//! Token

use oxc_ast::ast::RegExpFlags;
use oxc_span::Span;

use super::kind::Kind;

#[cfg(target_pointer_width = "64")]
mod size_asserts {
    use oxc_index::assert_eq_size;

    assert_eq_size!(super::Token, [u8; 16]);
}

#[derive(Debug, Clone)]
pub struct Token {
    /// Token Kind
    pub kind: Kind,

    /// Start offset in source
    pub start: u32,

    /// End offset in source
    pub end: u32,

    /// Indicates the token is on a newline
    pub is_on_new_line: bool,

    /// Is the original string escaped?
    pub escaped: bool,

    pub value_index: u32,
}

impl Default for Token {
    fn default() -> Self {
        Self {
            kind: Kind::default(),
            start: 0,
            end: 0,
            is_on_new_line: false,
            escaped: false,
            value_index: u32::max_value(),
        }
    }
}

impl Token {
    pub fn span(&self) -> Span {
        Span::new(self.start, self.end)
    }
}

#[derive(Debug, Clone, Copy)]
pub struct RegExp<'a> {
    pub pattern: &'a str,
    pub flags: RegExpFlags,
}
