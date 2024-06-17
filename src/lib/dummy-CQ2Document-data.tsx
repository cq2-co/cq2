export const DummyCQ2DocumentData = {
  _id: "demo",
  read_only: false,
  user_name: "Joshua Bambrick",
  version1: {
    created_on: 1718213570381,
    thread_id: 0,
    title: "PEP 736 – Shorthand syntax for keyword arguments at invocation",
    content:
      '<h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#abstract"><strong>Abstract</strong></a></h2><p>This PEP proposes introducing syntactic sugar <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=)</code> for the pattern where a named argument is the same as the name of the variable corresponding to its value <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=x)</code>.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#motivation"><strong>Motivation</strong></a></h2><p>Keyword argument syntax can become needlessly repetitive and verbose.</p><p>Consider the following call:</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>my_function(\n  my_first_variable=my_first_variable,\n  my_second_variable=my_second_variable,\n  my_third_variable=my_third_variable,\n)</code></pre><p>The case of a keyword argument name matching the variable name of its value is prevalent among Python libraries. This verbosity and redundancy discourages use of named arguments and reduces readability by increasing visual noise.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#rationale"><strong>Rationale</strong></a></h2><p>There are two ways to invoke a function with arguments: by position and by keyword. Keyword arguments confer many benefits by being explicit, thus increasing readability and minimising the risk of inadvertent transposition. On the flipside, positional arguments are often used simply to minimise verbosity and visual noise.</p><p>We contend that a simple syntactic sugar used to simplify this common pattern which would confer numerous benefits:</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#encourages-use-of-named-arguments">Encourages use of named arguments</a></h3><p>This syntax would encourage the use of named arguments, thereby increasing readability and reducing bugs from argument transposition.</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#reduces-verbosity">Reduces verbosity</a></h3><p>By minimising visual noise and in some cases lines of code, we can increase readability.</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#encourages-consistent-variable-names">Encourages consistent variable names</a></h3><p>A common problem is that semantically identical variables have different names depending on their contexts. This syntax would encourage authors to use the same variable name when calling a function as the argument name, which would increase consistency of variable names used and hence also readability.</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#highlights-arguments-not-following-this-pattern">Highlights arguments not following this pattern</a></h3><p>With the current syntax, function calls where many arguments are forwarded from the local context can make other argument values easy to miss due to the visual noise. For example:</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>add_middleware(\n    excluded_urls=excluded_urls,\n    server_request=server_request,\n    client_request=client_request,\n    client_response=client_response,\n    span_details=_get_span_details(),\n    tracer=tracer,\n    meter=meter,\n)</code></pre><p>With this syntax, the exceptional arguments become easier to identify:</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>add_middleware(\n    excluded_urls=,\n    server_request=,\n    client_request=,\n    client_response=,\n    span_details=_get_span_details(),\n    tracer=,\n    meter=,\n)</code></pre><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#applicability-to-dictionary-construction">Applicability to dictionary construction</a></h3><p>This syntax can be applied to dictionary construction where a similar pattern frequently occurs (where dictionary keys are identical the names of the variables assigned as their values), <code class="bg-neutral-100 text-neutral-700 p-0.5">{"x": x, "y": y}</code> or <code class="bg-neutral-100 text-neutral-700 p-0.5">dict(x=x, y=y)</code>. With this feature, this can now also be trivially written as <code class="bg-neutral-100 text-neutral-700 p-0.5">dict(x=, y=)</code>. Whether to further support similar syntax in dictionary literals is an open question out of the scope of this PEP.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#specification"><strong>Specification</strong></a></h2><p>We propose to introduce syntactic sugar such that, if the value of a keyword argument is omitted from a function invocation, the argument’s value is inferred to be the variable matching that name at the invocation scope.</p><p>For example, the function invocation:</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>my_function(my_first_variable=, my_second_variable=, my_third_variable=)</code></pre><p>Will be interpreted exactly equivalently to following in existing syntax:</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>my_function(\n  my_first_variable=my_first_variable,\n  my_second_variable=my_second_variable,\n  my_third_variable=my_third_variable,\n)</code></pre><p>If no variable matches that name in the invocation scope, a <code class="bg-neutral-100 text-neutral-700 p-0.5">NameError</code> is raised in an identical manner as would be with the established expanded syntax.</p><p>This proposal only pertains to function invocations; function definitions are unaffected by the syntax change. All existing valid syntax is unchanged.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#backwards-compatibility"><strong>Backwards Compatibility</strong></a></h2><p>Only new syntax is added which was previously syntactically erroneous. No existing valid syntax is modified. As such, the changes proposed are fully backwards compatible.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#security-implications"><strong>Security Implications</strong></a></h2><p>There are no security implications for this change.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#how-to-teach-this"><strong>How to Teach This</strong></a></h2><p>Programmers may learn about this feature as an optional abbreviated syntax where keyword arguments are taught. The <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://docs.python.org/3/glossary.html#term-argument">Python Glossary</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments">Tutorial</a> may be updated accordingly.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#prior-art"><strong>Prior Art</strong></a></h2><p>Python already possesses a very similar feature in f-string interpolation where <code class="bg-neutral-100 text-neutral-700 p-0.5">f\'{x=}\'</code> is effectively expanded to <code class="bg-neutral-100 text-neutral-700 p-0.5">f\'x={x}\'</code> (see <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://github.com/python/cpython/issues/80998">related GitHub issue</a>).</p><p>Several modern languages provide similar features during function invocation, sometimes referred to as ‘punning’. For example:</p><ul class="list-disc ml-8"><li><p>In Ruby, <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x:, y:)</code> is syntactic sugar for <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x: x, y: y)</code>. See the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://www.ruby-lang.org/en/news/2021/12/25/ruby-3-1-0-released/#:~:text=Other%20Notable%20New%20Features">Ruby 3.1.0 release notes</a> (search for “keyword arguments”).</p></li><li><p>In ReasonML, <code class="bg-neutral-100 text-neutral-700 p-0.5">f(~x, ~y)</code> is syntactic sugar for <code class="bg-neutral-100 text-neutral-700 p-0.5">f(~x=x, ~y=y)</code>. See the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://reasonml.github.io/docs/en/function#function-application">ReasonML function documentation</a> (search for “punning”).</p></li><li><p>In SystemVerilog, <code class="bg-neutral-100 text-neutral-700 p-0.5">(.mult, .mop1, .data);</code> is syntactic sugar for <code class="bg-neutral-100 text-neutral-700 p-0.5">(.mult(mult), .mop1(mop1),&nbsp; .data(data));</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="http://www.sunburst-design.com/papers/CummingsDesignCon2005_SystemVerilog_ImplicitPorts.pdf">SystemVerilog Implicit Port Connections</a>.</p></li><li><p>In Jakt, <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x, y)</code> is syntactic sugar for <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x: x, y: y)</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://github.com/SerenityOS/jakt?tab=readme-ov-file#function-calls">The Jakt programming language</a>.</p></li></ul><p>Beyond function invocation specifically, more languages offer similar features:</p><ul class="list-disc ml-8"><li><p>In OCaml, <code class="bg-neutral-100 text-neutral-700 p-0.5">let+ x in …</code> is syntactic sugar for <code class="bg-neutral-100 text-neutral-700 p-0.5">let+ x = x in …</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://v2.ocaml.org/manual/bindingops.html#ss:letops-punning">OCaml Short notation for variable bindings (let-punning)</a>.</p></li><li><p>In JavaScript, <code class="bg-neutral-100 text-neutral-700 p-0.5">{ x, y }</code> is syntactic sugar for <code class="bg-neutral-100 text-neutral-700 p-0.5">{x: x, y: y}</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer">JavaScript Object Initializer</a>.</p></li><li><p>In Rust, <code class="bg-neutral-100 text-neutral-700 p-0.5">User { x, y }</code> is shorthand for <code class="bg-neutral-100 text-neutral-700 p-0.5">User {x: x, y: y}</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://doc.rust-lang.org/book/ch05-01-defining-structs.html#using-the-field-init-shorthand-when-variables-and-fields-have-the-same-name">Rust Using the Field Init Shorthand</a>.</p></li></ul><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#applicability"><strong>Applicability</strong></a></h2><p>We analysed popular Python libraries from the last few years using <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://gist.github.com/joshuabambrick/a850d0e0050129b9252c748fa06c48b2">this script</a> to compute:</p><ul class="list-disc ml-8"><li><p>The number of keyword arguments were of the form <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=x)</code> at invocation.</p></li><li><p>The percentage of keyword arguments which had the form <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=x)</code> at invocation.</p></li><li><p>The number of lines of code which could be saved by using this syntactic sugar to reduce the need for line wraps.</p></li></ul><p>The purpose of this exercise was to compute statistics about the prevalence of this pattern and should not be interpreted as a recommendation that the proposed syntactic sugar should be applied universally.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#proposed-syntax"><strong>Proposed Syntax</strong></a></h2><p>While this feature has been proposed on numerous occasions with several different forms <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id13">[1]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id14">[2]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id15">[3]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id16">[4]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id17">[5]</a>, <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id18">[6]</a> we have opted to advocate for the <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=)</code> form for the following reasons:</p><ul class="list-disc ml-8"><li><p>This feature has been proposed frequently over a ten year period with the <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=)</code> or <code class="bg-neutral-100 text-neutral-700 p-0.5">f(=x)</code> being by far the most common syntax <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id13">[1]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id14">[2]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id18">[6]</a>. This is a strong indicator that it is the obvious notation.</p></li><li><p>The proposed syntax closely matches the f-string debug <code class="bg-neutral-100 text-neutral-700 p-0.5">f\'{var=}\'</code> syntax (established Pythonic style) and serves an almost identical purpose.</p></li><li><p>The proposed syntax is exactly analogous to the Ruby keyword argument syntactic sugar. See the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://www.ruby-lang.org/en/news/2021/12/25/ruby-3-1-0-released/#:~:text=Other%20Notable%20New%20Features">Ruby 3.1.0 release notes</a> (search for “keyword arguments”).</p></li><li><p>The syntax is easy to implement as it is simple syntactic sugar.</p></li><li><p>When compared to the prefix form (see <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference internal" href="https://peps.python.org/pep-0736/#rejected-ideas">Rejected Ideas</a>), this syntax communicates “here is a parameter, go find its argument” which is more appropriate given the semantics of named arguments.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/130">A poll of Python developers</a> indicates that this is the most popular syntax among those proposed.</p></li></ul><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#rejected-ideas"><strong>Rejected Ideas</strong></a></h2><p>Many alternative syntaxes have been proposed however no syntax other than <code class="bg-neutral-100 text-neutral-700 p-0.5">f(=x)</code> or <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=)</code> has garnered significant support. We here enumerate some of the most popular proposed alternatives and why we ultimately reject them.</p><h3><code class="bg-neutral-100 text-neutral-700 p-0.5">f(a, b, *, x)</code></h3><p>On a few occasions the idea has been floated to borrow the syntax from keyword-only function definitions.</p><p>In favour of this proposal:</p><ul class="list-disc ml-8"><li><p>This syntax is familiar from its use to require keyword-only arguments in function definitions.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/130">A poll of Python developers</a> indicates that this is the second most popular syntax among those proposed.</p></li></ul><p>However, we object that:</p><ul class="list-disc ml-8"><li><p>For any given argument, it is less clear from local context whether it is positional or named. The <code class="bg-neutral-100 text-neutral-700 p-0.5">*</code> could easily be missed in a long argument list and named arguments may be read as positional or vice versa.</p></li><li><p>It is unclear whether keyword arguments for which the value was not elided may follow the <code class="bg-neutral-100 text-neutral-700 p-0.5">*</code>. If so, then their relative position will be inconsistent but if not, then an arbitrary grouping is enforced between different types of keyword arguments and reordering would be necessary if only one name was changed.</p></li><li><p>The use of <code class="bg-neutral-100 text-neutral-700 p-0.5">*</code> in function calls is established and this proposal would introduce a new effect which could cause confusion. For example, <code class="bg-neutral-100 text-neutral-700 p-0.5">f(a, *x, y)</code> would mean something different than <code class="bg-neutral-100 text-neutral-700 p-0.5">f(a, *, x, y)</code>.</p></li></ul><h3><code class="bg-neutral-100 text-neutral-700 p-0.5">f(=x)</code></h3><p>In favour of this form:</p><ul class="list-disc ml-8"><li><p>The prefix operator is more similar to the established <code class="bg-neutral-100 text-neutral-700 p-0.5">*args</code> and <code class="bg-neutral-100 text-neutral-700 p-0.5">**kwargs</code> syntax for function calls.</p></li><li><p>It draws more attention to itself when arguments are arranged vertically. In particular, if the arguments are of different lengths it is harder to find the equal sign at the end. Moreover, since Python is read left to right, the use of this feature is clearer to the reader earlier on.</p></li></ul><p>On the contrary:</p><ul class="list-disc ml-8"><li><p>While the prefix version is visually louder, in practice, there is no need for this feature to shout its presence any more than a typical named argument. By the time we read to the <code class="bg-neutral-100 text-neutral-700 p-0.5">=</code> it is clear that the value is filled in automatically just as the value is clear in the typical keyword argument case.</p></li><li><p>Semantically, this form communicates ‘here is a value, fill in the parameter’ which is not what we want to convey.</p></li><li><p>It is less similar to f-string syntax.</p></li><li><p>It is less obvious that arbitrary expressions are invalid, e.g. <code class="bg-neutral-100 text-neutral-700 p-0.5">f(=a + b)</code>.</p></li></ul><h3><code class="bg-neutral-100 text-neutral-700 p-0.5">f(%x)</code> or <code class="bg-neutral-100 text-neutral-700 p-0.5">f(:x)</code> or <code class="bg-neutral-100 text-neutral-700 p-0.5">f(.x)</code></h3><p>Several flavours of this syntax have been proposed with the prefix form substituting another character for <code class="bg-neutral-100 text-neutral-700 p-0.5">=</code>. However, no such form has gained traction and the choice of symbol seems arbitrary compared to <code class="bg-neutral-100 text-neutral-700 p-0.5">=</code>. Additionally, there is less precedent in terms of existing language features (such as f-string) or other languages (such as Ruby).</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#objections"><strong>Objections</strong></a></h2><p>There are only a few hard objections to the introduction of this syntactic sugar. Most of those not in favour of this feature are in the camp of ‘I wouldn’t use it’. However, over the extensive conversations about this feature, the following objections were the most common:</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#the-syntax-is-ugly">The syntax is ugly</a></h3><p>This objection is by far the most common. On the contrary, we argue that:</p><ul class="list-disc ml-8"><li><p>This objection is subjective and many community members disagree.</p></li><li><p>A nearly-identical syntax is already established for f-strings.</p></li><li><p>Programmers will, as ever, adjust over time.</p></li></ul><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#the-feature-is-confusing">The feature is confusing</a></h3><p>We argue that:</p><ul class="list-disc ml-8"><li><p>Introducing new features typically has this impact temporarily.</p></li><li><p>The syntax is very similar to the established <code class="bg-neutral-100 text-neutral-700 p-0.5">f\'{x=}\'</code> syntax.</p></li><li><p>The feature and syntax are familiar from other popular modern languages.</p></li><li><p>The expansion of <code class="bg-neutral-100 text-neutral-700 p-0.5">x=</code> to <code class="bg-neutral-100 text-neutral-700 p-0.5">x=x</code> is in fact a trivial feature and inherently significantly less complex than <code class="bg-neutral-100 text-neutral-700 p-0.5">*arg</code> and <code class="bg-neutral-100 text-neutral-700 p-0.5">**kwarg</code> expansion.</p></li><li><p>This particular syntactic form has been independently proposed on numerous occasions, indicating that it is the most obvious <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id13">[1]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id14">[2]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id18">[6]</a>.</p></li></ul><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#the-feature-is-not-explicit">The feature is not explicit</a></h3><p>We recognise that, in an obvious sense, the argument value is ‘implicit’ in this proposed syntax. However, we do not think that this is what the Zen of Python is aiming to discourage.</p><p>In the sense that we take the Zen to be referring to, keyword arguments (for example) are more explicit than positional arguments where the argument name is omitted and impossible to tell from the local context. Conversely, the syntactic sugar for integers <code class="bg-neutral-100 text-neutral-700 p-0.5">x += 1</code> is not more implicit than <code class="bg-neutral-100 text-neutral-700 p-0.5">x = x + 1</code> in this sense, even though the variable is omitted from the right hand side, because it is immediately obvious from the local context what it is.</p><p>The syntax proposed in this PEP is much more closely analogous to the <code class="bg-neutral-100 text-neutral-700 p-0.5">x += 1</code> example (although simpler since we do not propose to introduce a new operation). Moreover, the introduction of this syntactic sugar should encourage the use of keyword arguments over positional ones, making typical Python codebases more explicit in general.</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#the-feature-adds-another-way-of-doing-things">The feature adds another way of doing things</a></h3><p>The same argument can be made against all syntax changes. This is a simple syntactic sugar, much as <code class="bg-neutral-100 text-neutral-700 p-0.5">x += 1</code> is sugar for <code class="bg-neutral-100 text-neutral-700 p-0.5">x = x + 1</code> when <code class="bg-neutral-100 text-neutral-700 p-0.5">x</code> is an integer. This isn’t tantamount to a ‘new way’ of passing arguments but a more readable notation for the same way.</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#renaming-the-variable-in-the-calling-context-will-break-the-code">Renaming the variable in the calling context will break the code</a></h3><p>A <code class="bg-neutral-100 text-neutral-700 p-0.5">NameError</code> would make the mistake clear in most cases. There may be confusion if a variable from a broader scope has the same name as the original variable, so no <code class="bg-neutral-100 text-neutral-700 p-0.5">NameError</code> would be raised. However, this issue can also occur with keyword arguments using the current syntax (arguably, this syntactic sugar could make it harder to spot). Moreover, having variables with the same name in different scopes is broadly considered bad practice and discouraged by linters.</p><p>Code editors could highlight the issue based on static analysis - <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=)</code> is exactly equivalent to writing <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=x)</code>. If <code class="bg-neutral-100 text-neutral-700 p-0.5">x</code> does not exist, modern editors have no problem highlighting the issue.</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#this-syntax-increases-coupling">This syntax increases coupling</a></h3><p>We recognise that, as ever, all syntax has the potential for misuse and so should be applied judiciously to improve codebases. In this case, if a parameter and its value have the same semantics in both contexts, that may suggest that using this new syntax is appropriate and will help ameliorate the risk of unintentional desynchronisation which harms readability.</p><p>However, if the two variables have different semantics, that may suggest that this feature should not be used to encourage consistency or even that they should be renamed.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#recommendations-for-using-this-syntax"><strong>Recommendations for using this syntax</strong></a></h2><p>As with any other language feature, the programmer should exercise their own judgement about whether it is prudent to use it in any given context. We do not recommend enforcing a rule to use the feature in all cases where it may be applicable.</p><p>As described <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://peps.python.org/pep-0736/Thissyntaxincreasescoupling">above</a>, we propose that a reasonable rule of thumb would be to use this in cases where a parameter and its argument have the same semantics in order to reduce unintentional desynchronisation without causing inappropriate coupling.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#impact-on-editing"><strong>Impact on editing</strong></a></h2><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#using-a-plain-text-editor">Using a plain text editor</a></h3><p>Editing with a plain text editor should generally be unaffected.</p><p>When renaming a variable using a ‘Find-Replace’ method, where this syntax is used the developer will come across the function argument at invocation (as they would if this syntax was not used). At that point, they can as usual decide whether to update the argument as well or expand to the full <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=x)</code> syntax.</p><p>As with the current syntax, a ‘Find-Replace All’ method would fail since the keyword argument would not exist at function definition, in the vast majority of cases.</p><p>If the developer leaves the argument name unchanged and forgets to update its value, a <code class="bg-neutral-100 text-neutral-700 p-0.5">NameError</code> will typically be raised as described <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://peps.python.org/pep-0736/Renamingthevariableinthecallingcontextwillbreakthecode">above</a>.</p><h3><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#proposals-for-ides">Proposals for IDEs</a></h3><p>In response to community feedback, we include some suggestions regarding how IDEs could handle this syntax. However, we of course defer to the domain experts developing IDEs to use their own discretion.</p><p>Most considerations are made simple by recognising that <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=)</code> is just syntactic sugar for <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=x)</code> and should be treated the same as at present.</p><h4><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#highlighting-nameerrors">Highlighting NameErrors</a></h4><p>IDEs typically offer a feature to highlight code that may cause a <code class="bg-neutral-100 text-neutral-700 p-0.5">NameError</code>. We recommend that this syntax be treated similarly to the expanded form <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=x)</code> to identify and highlight cases where the elided value variable may not exist. What visual cue may be used to highlight these cases may be the same or different from that which would be used with the current syntax, depending on the IDE.</p><h4><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#jump-to-definition">Jump to definition</a></h4><p>There are a few possible ways that a ‘jump to definition’ feature could be implemented depending on the caret/cursor position.</p><p>One option is to:</p><ul class="list-disc ml-8"><li><p>Jump to the argument in the function definition if the caret/cursor is on the argument</p></li><li><p>Jump to the definition of the elided variable if the caret/cursor is on the character following the <code class="bg-neutral-100 text-neutral-700 p-0.5">=</code> in our proposed syntax.</p></li></ul><p>Another, potentially complementary, option would be to expand the syntax visually on mouseover and enable a <code class="bg-neutral-100 text-neutral-700 p-0.5">Ctrl+Click</code> (or <code class="bg-neutral-100 text-neutral-700 p-0.5">Cmd+Click</code>) to the definition of the variable.</p><h4><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#rename-symbol">Rename symbol</a></h4><p>There are a few ways that IDEs may wish to support a ‘Rename symbol’ feature for this syntax. For example, if the argument is being renamed, the IDE may:</p><ul class="list-disc ml-8"><li><p>Also rename the variable used as its value in each calling context where this syntax is used</p></li><li><p>Expand to use the full syntax to pass the variable used as its value</p></li><li><p>Prompt the developer to select between the two above options</p></li></ul><p>The last option here seems most preferable in order to reduce unintentional desynchronisation of names while highlighting the user to the changes.</p><h2><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline toc-backref" href="https://peps.python.org/pep-0736/#reference-implementation"><strong>Reference Implementation</strong></a></h2><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://github.com/Hels15/cpython/tree/last-build">A proposed implementation</a> for cpython has been provided by @Hels15.</p>',
    highlights: [
      {
        highlight_id: 0,
        start: "/p[7]/text()[1]",
        startOffset: 0,
        end: "/p[7]/text()[1]",
        endOffset: 133,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 1,
      },
      {
        highlight_id: 1,
        start: "/p[9]/text()[1]",
        startOffset: 0,
        end: "/p[9]/text()[1]",
        endOffset: 303,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 2,
      },
      {
        highlight_id: 2,
        start: "/p[8]/text()[1]",
        startOffset: 0,
        end: "/p[8]/text()[1]",
        endOffset: 88,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 3,
      },
      {
        highlight_id: 3,
        start: "/p[12]/text()[1]",
        startOffset: 0,
        end: "/p[12]/text()[4]",
        endOffset: 116,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 4,
      },
      {
        highlight_id: 4,
        start: "/p[21]/text()[1]",
        startOffset: 0,
        end: "/p[21]/text()[4]",
        endOffset: 2,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 5,
      },
      {
        highlight_id: 5,
        start: "/p[25]/text()[1]",
        startOffset: 0,
        end: "/p[25]/text()[1]",
        endOffset: 206,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 6,
      },
      {
        highlight_id: 6,
        start: "/h3[10]/a[1]/text()[1]",
        startOffset: 0,
        end: "/h3[10]/a[1]/text()[1]",
        endOffset: 24,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 7,
      },
    ],
    comments: [
      {
        comment_id: 0,
        thread_id: 0,
        user_name: "Joshua Bambrick",
        content:
          '<p>This is a CQ2Document thread for <a target="_blank" rel="noopener nofollow ugc" class="text-[#797874] underline" href="https://peps.python.org/pep-0736/">PEP 736 </a>which is currently in draft.</p><p>Previous threads have generated a lot of conversation already so it would be really appreciated if you could read the PEP and previous CQ2Document before contributing and confirm whether your suggestion has already been addressed satisfactorily.</p><p>Thanks so much to everyone who has contributed their thoughts so far. Some minor suggestions have been omitted from this post for brevity but if you feel I’m missing a critical point that was previously made, please send a Discuss message.</p><h2><strong>Noted PEP feedback</strong></h2><p>The following feedback on the PEP itself has been noted and I will do my best to address it in a subsequent edit:</p><ul class="list-disc ml-8"><li><p>Correct ‘named variables’ to ‘named arguments’</p></li><li><p>Clarify our response to ‘explicit is better than implicit’ objection</p></li><li><p>Address the balance of coupling semantically distinct variables vs avoiding desynchronising semantically equivalent ones</p></li><li><p>Explain the impact on editing code and IDEs</p></li></ul><h2><strong>Ongoing CQ2Document</strong></h2><p>The publication of the PEP sparked a few conversations on <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/304">the previous thread </a>. I’ll mention them and give my own current take here, but if you have substantive contributions which will further the CQ2Document on these points, please do offer them here.</p><h3><strong>Chosen syntax</strong></h3><p>Much of the previous CQ2Document has centred on the particular syntax chosen for the PEP. The most common alternative proposal is <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x, *, y)</code>. I think this is the strongest alternative that has been proposed as it closely resembles the keyword-only syntax of function definitions and it was the second most popular in <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/130">the poll </a>.</p><p>I’m not personally wedded to the syntax presented in the PEP (indeed that syntax is different from the one I originally proposed). However, so far, I haven’t seen any concrete benefits of any alternative which are not already described in the PEP, instead most of the emphasis is on stylistic preference. The weight of merits as presented in the PEP still seem stronger for the <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=)</code> syntax.</p><h3><strong>Debate on adherence to ‘explicit is better than implicit’</strong></h3><p>I recognise that the explanation given in the PEP is inadequate and that it is true that, in an obvious sense, the argument value is ‘implicit’ in our proposed syntax. However, I do not think that this is what the Zen of Python is trying to discourage.</p><p>In the sense that I take the Zen to be referring to, keyword arguments (for example) are objectively more explicit than positional arguments where the argument name is omitted and impossible to tell from the local context. Conversely, the syntactic sugar for integers <code class="bg-neutral-100 text-neutral-700 p-0.5">x += 1</code> is not more implicit than <code class="bg-neutral-100 text-neutral-700 p-0.5">x = x + 1</code> in this sense, even though the variable is omitted from the right hand side, because it is immediately obvious from the local context what it is. The syntax proposed in this PEP is much more analogous to the second example, and is designed in part to encourage use of keyword arguments which are more explicit than positional ones.</p><p>I’m unconvinced that we’re going to make any more progress on this so I’d not recommend much more CQ2Document on this area. I will edit the PEP to be clearer.</p><h3><strong>Overall merits and potential for misuse</strong></h3><p>As ever, all syntax has the potential for misuse and so should be used judiciously. In this case, if a parameter and its value have the same semantics in both contexts, that may suggest that using this new syntax is appropriate. If not, that may suggest that they should have different names. Our analysis of popular repos showed that the former is at least very common.</p><p>The status quo in Python encourages developers (e.g., me, at a minimum) to use shorter and less descriptive names to save keystrokes or use positional arguments to reduce visual clutter. We argue that this new syntax presents a valuable nudge towards use of keyword arguments and will ameliorate the risk of desynchronisation of semantically equivalent variables in different contexts which harms readability. Whether the risk of misuse outweighs the benefits of the proposed syntax enumerated in the PEP (the degree of which is hard to measure, as with any hypothetical change) is a judgement for the SC to make. I’m open to suggestions of objective evidence that could help shed light on this.</p>',
        created_on: 1718213660718,
        highlights: [],
        is_conclusion: false,
      },
      {
        comment_id: 1,
        thread_id: 0,
        user_name: "Jelle Zijlstra",
        content:
          '<p>I like the idea. Functions with many keyword arguments are common in lots of real-world Python code, and this will help make calls a little less verbose and therefore easier for humans to understand.</p><p>The proposed syntax is good because it marks each individual keyword argument clearly. The alternative <code class="bg-neutral-100 text-neutral-700 p-0.5">f(*, a, b)</code> syntax would make it harder to see at a glance that <code class="bg-neutral-100 text-neutral-700 p-0.5">a</code> is this new special kind of keyword argument.</p><p>I would caution against arguing too much on what exactly the Zen of Python should have to say here. The Zen is useful for each of us to think about as we consider changes to the language, but it’s inherently open to interpretation, and nobody is going to convince anyone by arguing over that interpretation.</p>',
        created_on: 1718215068572,
        highlights: [
          {
            highlight_id: 0,
            start: "/p[3]/text()[1]",
            startOffset: 0,
            end: "/p[3]/text()[1]",
            endOffset: 99,
            thread_id: 0,
            comment_id: 1,
            to_thread_id: 8,
          },
        ],
        is_conclusion: false,
      },
    ],
    threads: [
      {
        thread_id: 4,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 3,
        quote_by: "Joshua Bambrick",
        quote:
          'This syntax can be applied to dictionary construction where a similar pattern frequently occurs (where dictionary keys are identical the names of the variables assigned as their values), {"x": x, "y": y} or dict(x=x, y=y). With this feature, this can now also be trivially written as dict(x=, y=). Whether to further support similar syntax in dictionary literals is an open question out of the scope of this PEP.',
        comments: [
          {
            comment_id: 0,
            thread_id: 4,
            user_name: "Paul Moore",
            content:
              '<p>This is the only benefit of the new syntax that I’d support. And while I do find having to type <code class="bg-neutral-100 text-neutral-700 p-0.5">dict(a=a, b=b)</code> annoying, it mostly only comes up at the REPL, or in throwaway code.</p>',
            created_on: 1718213980306,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
      {
        thread_id: 5,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 4,
        quote_by: "Joshua Bambrick",
        quote:
          "Python already possesses a very similar feature in f-string interpolation where f'{x=}' is effectively expanded to f'x={x}' (see related GitHub issue).",
        comments: [
          {
            comment_id: 0,
            thread_id: 5,
            user_name: "Paul Moore",
            content:
              "<p>This<em> does</em> act as a good argument that this is simply following a common trend, and not inventing something unusual. If the PEP’s argument was simply “lots of other languages do this, why don’t we?” then I’d say this section would be compelling. But conversely, I don’t think that “doing something because other languages do it” has been a particularly successful argument for adding features in the past - in cases where we <em>have</em> done it (conditional expressions and assignment expressions come to mind) the features have been controversial, and have usually had strong justifications on their own merit.</p>",
            created_on: 1718214075436,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
      {
        thread_id: 8,
        from_thread_id: 0,
        from_comment_id: 1,
        from_highlight_id: 0,
        quote_by: "Jelle Zijlstra",
        quote:
          "I would caution against arguing too much on what exactly the Zen of Python should have to say here.",
        comments: [
          {
            comment_id: 0,
            thread_id: 8,
            user_name: "Paul Moore",
            content:
              "<p>100% agreed. IMO, the <em>reason</em> there’s been a debate over principles from the Zen like explicit vs implicit is because the proposal leans heavily on the Zen for its arguments. In particular, the “Encourages use of named variables” section uses “explicit is better than implicit” as a justification, so it’s hardly surprising if people with different interpretations disagree. Of course, without the Zen quote, that rationale becomes “it’s more readable”, which is clearly very subjective, so the whole argument in that sentence becomes less compelling (as I noted above)</p>",
            created_on: 1718215114391,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
      {
        thread_id: 2,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 1,
        quote_by: "Joshua Bambrick",
        quote:
          "A common problem is that semantically identical variables have different names depending on their contexts. This syntax would encourage authors to use the same variable name when calling a function as the argument name, which would increase consistency of variable names used and hence also readability.",
        comments: [
          {
            comment_id: 0,
            thread_id: 2,
            user_name: "Paul Moore",
            content:
              '<p>This can just as easily be stated as “discourages context-appropriate variable names”. Take the example above again - a function to do a generalised motion calculation might well take a <code class="bg-neutral-100 text-neutral-700 p-0.5">velocity</code> argument. But in my code, <code class="bg-neutral-100 text-neutral-700 p-0.5">vehicle_velocity</code> might be a more meaningful name. Which again puts us back in the “don’t do this if it’s not appropriate” debate, just in a different context.</p>',
            created_on: 1718213870693,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 1,
            thread_id: 2,
            user_name: "Joshua Bambrick",
            content:
              "<p>True, this syntax may be misapplied and should be used judiciously as summarised in the thread description. I’ve added a note in the thread description to expand on the balance between risk of coupling vs benefit of synchronisation. I will consider specifically adding a recommendation in the PEP to use this syntax for variables that are semantically equivalent.</p>",
            created_on: 1718216212906,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
      {
        thread_id: 7,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 6,
        quote_by: "Joshua Bambrick",
        quote: "The feature is confusing",
        comments: [
          {
            comment_id: 0,
            thread_id: 7,
            user_name: "Paul Moore",
            content:
              "<p>You haven’t addressed my point (from the original thread) that there are two <em>types</em> of confusion - the “initial unfamiliarity” type (which is the one that you address in this section) and the “inherent awkwardness” type (that you don’t address at all). Please re-read my post on this from the original thread, because I don’t think you’ve addressed it properly.</p>",
            created_on: 1718214906486,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 1,
            thread_id: 7,
            user_name: "Joshua Bambrick",
            content:
              '<p>Thank you, I did miss <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/165">your point there</a> and have dug into it more closely. Overall, I don’t think I agree that this is ‘confusing’ as opposed to a suggestion that some will find it ‘incongruent’ with the rest of Python syntax. It’s clear that you’re not the only one who feels this way. However, I think this comes down to a matter of the particular syntax selected rather than the feature itself. The PEP describes several proposed syntaxes, of which I’m open to any. That said, while hotly disputed, the weight of the arguments and broad support appears to be behind the syntax described in the PEP.</p>',
            created_on: 1718216343716,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
      {
        thread_id: 3,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 2,
        quote_by: "Joshua Bambrick",
        quote:
          "By minimising visual noise and in some cases lines of code, we can increase readability.",
        comments: [
          {
            comment_id: 0,
            thread_id: 3,
            user_name: "Paul Moore",
            content:
              '<p>This is highly subjective, IMO. The syntax is less verbose when it’s a direct replacement of <code class="bg-neutral-100 text-neutral-700 p-0.5">var=&lt;some_calculation&gt;; f(var=var)</code>, but it’s <em>not</em> less verbose when replacing <code class="bg-neutral-100 text-neutral-700 p-0.5">f(var=&lt;some_calculation&gt;)</code>, or <code class="bg-neutral-100 text-neutral-700 p-0.5">local_name=&lt;some_calculation&gt;; f(var=local_name)</code>, or many other situations. So it’s hard to see this as an independent advantage, as opposed to “if you are currently typing <code class="bg-neutral-100 text-neutral-700 p-0.5">var=var</code> in function calls, you can save a few keystrokes”. And simply “saving keystrokes” is widely acknowledged as a <em>very</em> weak argument in favour of a new feature.</p>',
            created_on: 1718213890639,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 1,
            thread_id: 3,
            user_name: "Joshua Bambrick",
            content:
              '<p>I think this is also based on <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/pep-736-shorthand-syntax-for-keyword-arguments-at-invocation/43432/4">the error in the PEP</a> that you identified. <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=x)</code> will always be more verbose than <code class="bg-neutral-100 text-neutral-700 p-0.5">f(x=)</code>. Yes, if you introduce a redundant variable it will become more verbose but the PEP was not intended to suggest that.</p>',
            created_on: 1718216233100,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 2,
            thread_id: 3,
            user_name: "Paul Moore",
            content:
              '<p>I <em>strongly</em> dispute the claim that the variable is redundant. Certainly it may sometimes be redundant - but so can any construct in Python (yes, I’m using your "any construct can be misused argument against you ) The point here is that if you have a <em>non-redundant</em> variable, the PEP is either more verbose or more likely inapplicable.</p><p>No-one is arguing that not typing the second <code class="bg-neutral-100 text-neutral-700 p-0.5">x</code> in <code class="bg-neutral-100 text-neutral-700 p-0.5">x=x</code> isn’t shorter. The argument is that shortening that case isn’t a worthwhile use of a language feature (i.e., “just because we can do a thing doesn’t mean we should”).</p>',
            created_on: 1718216422372,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
      {
        thread_id: 6,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 5,
        quote_by: "Joshua Bambrick",
        quote:
          "The purpose of this exercise was to compute statistics about the prevalence of this pattern and should not be interpreted as a recommendation that the proposed syntactic sugar should be applied universally.",
        comments: [
          {
            comment_id: 0,
            thread_id: 6,
            user_name: "Paul Moore",
            content:
              '<p>This does establish that this is fairly common, and could immediately be used in quite a lot of places, in spite of the fact that I’m claiming that it’s often an anti-pattern. But I’m very unconvinced by the “lines saved” statistics, as I find that almost universally, collapsing a call into a smaller number of lines with multiple <code class="bg-neutral-100 text-neutral-700 p-0.5">var=</code> constructs per line is <em>less</em> readable. So the fact that formatters like <code class="bg-neutral-100 text-neutral-700 p-0.5">black</code> will do this without asking is overall (IMO) a net <em>loss</em> for the proposal, rather than a gain.</p>',
            created_on: 1718214845086,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 1,
            thread_id: 6,
            user_name: "Eric V. Smith",
            content:
              '<p>Is this actually in the PEP somewhere? I didn’t see anything about formatters. I would be surprised if any formatter, and especially <code class="bg-neutral-100 text-neutral-700 p-0.5">black</code>, did such a transformation, especially because <code class="bg-neutral-100 text-neutral-700 p-0.5">black</code> keeps the same AST before and after formatting.</p><p>I’m also -1 on the PEP, for the reasons <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline mention" href="https://discuss.python.org/u/pf_moore">@pf_moore</a> stated. I don’t think it’s adding any expressiveness to the language.</p>',
            created_on: 1718215308494,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 2,
            thread_id: 6,
            user_name: "Paul Moore",
            content:
              '<p>Not explicitly, no. But in the “Applicability” section, one of the metrics quoted is “lines saved” based (presumably) on the idea that</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>some_func(\n    argument_one=argument_one,\n    argument_two=argument_two,\n    argument_three=argument_three,\n    argument_four=argument_four,\n)</code></pre><p>could be converted into the “fewer lines” form</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>some_func(argument_one=, argument_two=, argument_three=, argument_four=)</code></pre><p>My point isn’t that a formatter would decide to use the new syntax (which as you say changes the AST), but rather that if I chose to use the new syntax in the form</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>some_func(\n    argument_one=,\n    argument_two=,\n    argument_three=,\n    argument_four=,\n)</code></pre><p>the formatter might choose to line-wrap it to the “shorter” form based on the implied “fewer lines” preference in the PEP, which I find significantly less readable. Basically, for function calls with many arguments, I prefer one argument per line as that makes the call easier to read (for me). Therefore, the new syntax would actually save <em>no</em> lines in my preferred style. And it might be another area where I find myself having to use <code class="bg-neutral-100 text-neutral-700 p-0.5"># fmt: off</code> to override formatters to get what I want.</p><p>Of course, what formatters would do with this new syntax is unknown at this point, they may take the view that if a function call uses PEP 736 syntax, one argument per line is the preferred reformatting. Maybe this is something that the PEP should discuss? Although if the authors prefer not to get into such style matters, I can accept that.</p>',
            created_on: 1718215379709,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 3,
            thread_id: 6,
            user_name: "Joshua Bambrick",
            content:
              "<p>I highly discourage formatters from applying this syntax globally by default for the agreed reasons. I’d be happy to add a suggestion in the PEP to think carefully before doing this.</p>",
            created_on: 1718216326829,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 4,
            thread_id: 6,
            user_name: "Paul Moore",
            content:
              '<p>I think you’re misunderstanding my point (as <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline mention" href="https://discuss.python.org/u/ericvsmith">@ericvsmith</a> did). I’m not suggesting formatters convert <code class="bg-neutral-100 text-neutral-700 p-0.5">x=x</code> into <code class="bg-neutral-100 text-neutral-700 p-0.5">x=</code>. That’s a change in the code, not just a formatting change, and IMO it’s unacceptable for <em>any</em> formatter to do this. I was pointing out that there’s no clear “best” way to format calls that use PEP 736 format. But see below for more.</p>',
            created_on: 1718216450315,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
      {
        thread_id: 1,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 0,
        quote_by: "Joshua Bambrick",
        quote:
          "This syntax would encourage the use of named arguments, thereby increasing readability and reducing bugs from argument transposition.",
        comments: [
          {
            comment_id: 0,
            thread_id: 1,
            user_name: "Paul Moore",
            content:
              '<p>I’m not clear what “named variables” is intended to mean here, but I don’t see why it’s less readable to say (for example) <code class="bg-neutral-100 text-neutral-700 p-0.5">velocity=distance/time</code> in a function call’s parameter list as opposed to saying <code class="bg-neutral-100 text-neutral-700 p-0.5">velocity=</code> coupled with an assignment <code class="bg-neutral-100 text-neutral-700 p-0.5">velocity=distance/time</code>. In fact, the latter is <em>less</em> readable, because you need to look elsewhere to find the value. And yes, I know you can say “don’t use the syntax in that case, then”. But that just reduces the argument to how often the construct <em>is</em> appropriate, and how frequently it will be misused by people who are, let’s say, “overenthusiastic” in their use of new features.</p>',
            created_on: 1718213852546,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 1,
            thread_id: 1,
            user_name: "Joshua Bambrick",
            content:
              '<p>This is based on <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/pep-736-shorthand-syntax-for-keyword-arguments-at-invocation/43432/4">an error in the PEP</a> that you identified. Encouraging use of named arguments (as the PEP should read) is important given the clear merits they offer over positional arguments. Current Python syntax penalises use of keyword arguments by introducing visual clutter.</p>',
            created_on: 1718216201275,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 2,
            thread_id: 1,
            user_name: "Paul Moore",
            content:
              '<p>I disagree. Named arguments are perfectly well encouraged now. The benefits of clearly linking the argument name and the value are present now - arguably more so, as the PEP <code class="bg-neutral-100 text-neutral-700 p-0.5">x=</code> syntax <em>hides</em> (to an extent) the fact that this refers to the value in the local variable <code class="bg-neutral-100 text-neutral-700 p-0.5">x</code>. Claiming that the existing syntax introduces “visual clutter” is simply restaing the (IMO extremely weak) argument that the PEP “reduces verbosity”. But of course there’s a lot of subjectivity to all this, so you may well disagree. I’m stating my objections so you can address them in the PEP, not to try to persuade you.</p>',
            created_on: 1718216404906,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 3,
            thread_id: 1,
            user_name: "Chris Angelico",
            content:
              "<p>The vast majority of functions in Python have all of their parameters as keyword-or-positional. The vast majority of function <em>calls</em> in Python use positional arguments. Is this “well encouraged”, or is the extra verbosity of having to label every argument a barrier to usage?</p>",
            created_on: 1718216518148,
            highlights: [
              {
                highlight_id: 0,
                start: "/p[1]/text()[1]",
                startOffset: 0,
                end: "/p[1]/text()[2]",
                endOffset: 36,
                thread_id: 1,
                comment_id: 3,
                to_thread_id: 9,
              },
            ],
            is_conclusion: false,
          },
          {
            comment_id: 4,
            thread_id: 1,
            user_name: "Cornelius Krupp",
            content:
              "<p>Do you have any statistics, for example a survey, that this verbosity is the reason that the majority of programmers are not using keyword arguments? How do you know that this feature is going to change this?</p><p>Or is this just based on your own opinions?</p><p>I probably would not change my behavior at all based on the presences of this feature, except for rare cases where the IDE suggests it or something.</p>",
            created_on: 1718216567343,
            highlights: [],
            is_conclusion: false,
          },
          {
            comment_id: 5,
            thread_id: 1,
            user_name: "Chris Angelico",
            content:
              '<p>No, I don’t have any survey. What I do have is data that disputes your claim that keyword arguments are “perfectly well encouraged now”. So this is based on statistical analysis of the Python standard library. You’re welcome to use the script on your own codebase, or any other large codebase, if you think the stats shown here are non-representative.</p><p>Script: <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline inline-onebox" href="https://github.com/Rosuav/shed/blob/master/find_kwargs.py">shed/find_kwargs.py at master · Rosuav/shed · GitHub</a><br>Usage: <code class="bg-neutral-100 text-neutral-700 p-0.5">python3 ~/shed/find_kwargs.py -q --no-test</code> from the CPython source directory (main branch s of today, 20240118).</p><p>Result:</p><pre class="bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"><code>Total function calls: 73573\nCalls with any kwarg: 5257 7.15%\nMaximum kwargs count: 20\nCalls with any \'x=x\': 1028 1.40%\n - compared to kwarg: 1028 19.55%\nMaximum num of \'x=x\': 11\nTotal keyword params: 10288 0.14 per call\nNum params where x=x: 1616 15.71%\nTotal function defns: 17304\nFunction params: pos: 179 0.51%\nFunction params: kwd: 1160 3.30%\nFunction params: any: 32611 92.86%</code></pre><p>Out of nearly 75,000 function calls, a mere 5000 use even a single keyword argument. Calls that have a mixture of positional and keyword arguments are counted in that, which means that thirteen out of fourteen function calls use entirely positional arguments. (I don’t have a way of identifying whether the functions being called are implemented in C or Python, though. That MAY make a difference, as it’s more work to implement keyword parameters in C.)</p><p>This is true despite the fact that function definitions are, by and large, entirely compatible with keyword arguments. Just half a percent of all function parameters are positional-only, with the overwhelming majority being positional-or-keyword - not at all surprising, since that’s what you get if you don’t explicitly ask for something else.</p><p>Does this count as “perfectly well encouraged”?</p>',
            created_on: 1718216640970,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
      {
        thread_id: 9,
        from_thread_id: 1,
        from_comment_id: 3,
        from_highlight_id: 0,
        quote_by: "Chris Angelico",
        quote:
          "The vast majority of functions in Python have all of their parameters as keyword-or-positional. The vast majority of function calls in Python use positional arguments.",
        comments: [
          {
            comment_id: 0,
            thread_id: 9,
            user_name: "H. Vetinari",
            content:
              '<p>Part of this has grown historically, as the separation into keyword-only arguments is relatively recent (at least in the sense of: “present in all commonly supported Python versions”). But it has several advantages from a usage and maintenance perspective – obviously not 100% of the time but still.</p><p>As a concrete example, scikit-learn has <a target="_blank" rel="noopener nofollow ugc" class="text-[#797874] underline" href="https://scikit-learn-enhancement-proposals.readthedocs.io/en/latest/slep009/proposal.html">moved </a>almost all their APIs to keyword-only usage – their functions tend to have lots of arguments, so it makes sense that they adopted this quickly. Other libraries (incl. e.g. SciPy) are cautiously considering the same thing (within reason; some APIs are positional by nature, but making all the optional bits kwarg-only is still desirable). Part of the reason these things take time is because we want to minimize breakage obviously, and it’s a fair bit of churn, though the end result is IMO worth it.</p>',
            created_on: 1718217337730,
            highlights: [],
            is_conclusion: false,
          },
        ],
      },
    ],
  },
};
