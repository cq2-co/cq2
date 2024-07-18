export const DummyCQ2DocumentData = {
  _id: "demo",
  user_name: "Isabella Jenkins",
  version1: {
    created_on: 1719234981959,
    thread_id: 0,
    is_concluded: false,
    title: "RFC 042 – Shorthand syntax for keyword arguments at invocation",
    content:
      '<h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Abstract</h2><p class="mt-[1em] first:mt-0">‎This RFC proposes introducing syntactic sugar <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=)</code> for the pattern where a named argument is the same as the name of the variable corresponding to its value <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code>.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Motivation</h2><p class="mt-[1em] first:mt-0">‎Keyword argument syntax can become needlessly repetitive and verbose.</p><p class="mt-[1em] first:mt-0">‎Consider the following call:</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎my_function(\n  my_first_variable=my_first_variable,\n  my_second_variable=my_second_variable,\n  my_third_variable=my_third_variable,\n)</code></pre><p class="mt-[1em] first:mt-0">‎The case of a keyword argument name matching the variable name of its value is prevalent among Python libraries. This verbosity and redundancy discourages use of named arguments and reduces readability by increasing visual noise.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Rationale</h2><p class="mt-[1em] first:mt-0">‎There are two ways to invoke a function with arguments: by position and by keyword. Keyword arguments confer many benefits by being explicit, thus increasing readability and minimising the risk of inadvertent transposition. On the flipside, positional arguments are often used simply to minimise verbosity and visual noise.</p><p class="mt-[1em] first:mt-0">‎We contend that a simple syntactic sugar used to simplify this common pattern which would confer numerous benefits:</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Encourages use of named variables</h3><p class="mt-[1em] first:mt-0">‎This syntax would encourage the use of named variables, thereby increasing readability and reducing bugs from argument transposition.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Reduces verbosity</h3><p class="mt-[1em] first:mt-0">‎By minimising visual noise and in some cases lines of code, we can increase readability.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Encourages consistent variable names</h3><p class="mt-[1em] first:mt-0">‎A common problem is that semantically identical variables have different names depending on their contexts. This syntax would encourage authors to use the same variable name when calling a function as the argument name, which would increase consistency of variable names used and hence also readability.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Highlights arguments not following this pattern</h3><p class="mt-[1em] first:mt-0">‎With the current syntax, function calls where many arguments are forwarded from the local context can make other argument values easy to miss due to the visual noise. For example:</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎add_middleware(\n    excluded_urls=excluded_urls,\n    server_request=server_request,\n    client_request=client_request,\n    client_response=client_response,\n    span_details=_get_span_details(),\n    tracer=tracer,\n    meter=meter,\n)</code></pre><p class="mt-[1em] first:mt-0">‎With this syntax, the exceptional arguments become easier to identify:</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎add_middleware(\n    excluded_urls=,\n    server_request=,\n    client_request=,\n    client_response=,\n    span_details=_get_span_details(),\n    tracer=,\n    meter=,\n)</code></pre><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Applicability to dictionary construction</h3><p class="mt-[1em] first:mt-0">‎This syntax can be applied to dictionary construction where a similar pattern frequently occurs (where dictionary keys are identical the names of the variables assigned as their values), <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎{"x": x, "y": y}</code> or <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎dict(x=x, y=y)</code>. With this feature, this can now also be trivially written as <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎dict(x=, y=)</code>. Whether to further support similar syntax in dictionary literals is an open question out of the scope of this RFC.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Specification</h2><p class="mt-[1em] first:mt-0">‎We propose to introduce syntactic sugar such that, if the value of a keyword argument is omitted from a function invocation, the argument’s value is inferred to be the variable matching that name at the invocation scope.</p><p class="mt-[1em] first:mt-0">‎For example, the function invocation:</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎my_function(my_first_variable=, my_second_variable=, my_third_variable=)</code></pre><p class="mt-[1em] first:mt-0">‎Will be interpreted exactly equivalently to following in existing syntax:</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎my_function(\n  my_first_variable=my_first_variable,\n  my_second_variable=my_second_variable,\n  my_third_variable=my_third_variable,\n)</code></pre><p class="mt-[1em] first:mt-0">‎If no variable matches that name in the invocation scope, a <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎NameError</code> is raised in an identical manner as would be with the established expanded syntax.</p><p class="mt-[1em] first:mt-0">‎This proposal only pertains to function invocations; function definitions are unaffected by the syntax change. All existing valid syntax is unchanged.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Backwards Compatibility</h2><p class="mt-[1em] first:mt-0">‎Only new syntax is added which was previously syntactically erroneous. No existing valid syntax is modified. As such, the changes proposed are fully backwards compatible.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Security Implications</h2><p class="mt-[1em] first:mt-0">‎There are no security implications for this change.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎How to Teach This</h2><p class="mt-[1em] first:mt-0">‎Programmers may learn about this feature as an optional abbreviated syntax where keyword arguments are taught. The <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://docs.python.org/3/glossary.html#term-argument">Python Glossary</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments">Tutorial</a> may be updated accordingly.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Prior Art</h2><p class="mt-[1em] first:mt-0">‎Python already possesses a very similar feature in f-string interpolation where <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f\'{x=}\'</code> is effectively expanded to <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f\'x={x}\'</code> (see <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://github.com/python/cpython/issues/80998">related GitHub issue</a>).</p><p class="mt-[1em] first:mt-0">‎Several modern languages provide similar features during function invocation, sometimes referred to as ‘punning’. For example:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎In Ruby, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x:, y:)</code> is syntactic sugar for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x: x, y: y)</code>. See the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://www.ruby-lang.org/en/news/2021/12/25/ruby-3-1-0-released/#:~:text=Other%20Notable%20New%20Features">Ruby 3.1.0 release notes</a> (search for “keyword arguments”).</p></li><li><p class="mt-[1em] first:mt-0">‎In ReasonML, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(~x, ~y)</code> is syntactic sugar for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(~x=x, ~y=y)</code>. See the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://reasonml.github.io/docs/en/function#function-application">ReasonML function documentation</a> (search for “punning”).</p></li><li><p class="mt-[1em] first:mt-0">‎In SystemVerilog, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎(.mult, .mop1, .data);</code> is syntactic sugar for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎(.mult(mult), .mop1(mop1),&nbsp; .data(data));</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="http://www.sunburst-design.com/papers/CummingsDesignCon2005_SystemVerilog_ImplicitPorts.pdf">SystemVerilog Implicit Port Connections</a>.</p></li><li><p class="mt-[1em] first:mt-0">‎In Jakt, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x, y)</code> is syntactic sugar for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x: x, y: y)</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://github.com/SerenityOS/jakt?tab=readme-ov-file#function-calls">The Jakt programming language</a>.</p></li></ul><p class="mt-[1em] first:mt-0">‎Beyond function invocation specifically, more languages offer similar features:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎In OCaml, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎let+ x in …</code> is syntactic sugar for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎let+ x = x in …</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://v2.ocaml.org/manual/bindingops.html#ss:letops-punning">OCaml Short notation for variable bindings (let-punning)</a>.</p></li><li><p class="mt-[1em] first:mt-0">‎In JavaScript, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎{ x, y }</code> is syntactic sugar for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎{x: x, y: y}</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer">JavaScript Object Initializer</a>.</p></li><li><p class="mt-[1em] first:mt-0">‎In Rust, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎User { x, y }</code> is shorthand for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎User {x: x, y: y}</code>. See <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://doc.rust-lang.org/book/ch05-01-defining-structs.html#using-the-field-init-shorthand-when-variables-and-fields-have-the-same-name">Rust Using the Field Init Shorthand</a>.</p></li></ul><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Applicability</h2><p class="mt-[1em] first:mt-0">‎We analysed popular Python libraries from the last few years using <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://gist.github.com/joshuabambrick/a850d0e0050129b9252c748fa06c48b2">this script</a> to compute:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎The number of keyword arguments were of the form <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code> at invocation.</p></li><li><p class="mt-[1em] first:mt-0">‎The percentage of keyword arguments which had the form <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code> at invocation.</p></li><li><p class="mt-[1em] first:mt-0">‎The number of lines of code which could be saved by using this syntactic sugar to reduce the need for line wraps.</p></li></ul><p class="mt-[1em] first:mt-0">‎The purpose of this exercise was to compute statistics about the prevalence of this pattern and should not be interpreted as a recommendation that the proposed syntactic sugar should be applied universally.</p><p class="mt-[1em] first:mt-0">‎Based on <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://peps.python.org/pep-0736/#applicability:~:text=Statistic,117">this table</a>, we note that the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code> keyword argument pattern is widespread, accounting for 10-20% of all keyword argument uses.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Proposed Syntax</h2><p class="mt-[1em] first:mt-0">‎While this feature has been proposed on numerous occasions with several different forms <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id13">[1]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id14">[2]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id15">[3]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id16">[4]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id17">[5]</a>, <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id18">[6]</a> we have opted to advocate for the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=)</code> form for the following reasons:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎This feature has been proposed frequently over a ten year period with the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=)</code> or <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(=x)</code> being by far the most common syntax <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id13">[1]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id14">[2]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id18">[6]</a>. This is a strong indicator that it is the obvious notation.</p></li><li><p class="mt-[1em] first:mt-0">‎The proposed syntax closely matches the f-string debug <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f\'{var=}\'</code> syntax (established Pythonic style) and serves an almost identical purpose.</p></li><li><p class="mt-[1em] first:mt-0">‎The proposed syntax is exactly analogous to the Ruby keyword argument syntactic sugar. See the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://www.ruby-lang.org/en/news/2021/12/25/ruby-3-1-0-released/#:~:text=Other%20Notable%20New%20Features">Ruby 3.1.0 release notes</a> (search for “keyword arguments”).</p></li><li><p class="mt-[1em] first:mt-0">‎The syntax is easy to implement as it is simple syntactic sugar.</p></li><li><p class="mt-[1em] first:mt-0">‎When compared to the prefix form (see <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference internal" href="https://peps.python.org/pep-0736/#rejected-ideas">Rejected Ideas</a>), this syntax communicates “here is a parameter, go find its argument” which is more appropriate given the semantics of named arguments.</p></li><li><p class="mt-[1em] first:mt-0">‎<a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/130">A poll of Python developers</a> indicates that this is the most popular syntax among those proposed.</p></li></ul><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Rejected Ideas</h2><p class="mt-[1em] first:mt-0">‎Many alternative syntaxes have been proposed however no syntax other than <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(=x)</code> or <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=)</code> has garnered significant support. We here enumerate some of the most popular proposed alternatives and why we ultimately reject them.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a, b, *, x)</code></h3><p class="mt-[1em] first:mt-0">‎On a few occasions the idea has been floated to borrow the syntax from keyword-only function definitions.</p><p class="mt-[1em] first:mt-0">‎In favour of this proposal:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎This syntax is familiar from its use to require keyword-only arguments in function definitions.</p></li><li><p class="mt-[1em] first:mt-0">‎<a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/130">A poll of Python developers</a> indicates that this is the second most popular syntax among those proposed.</p></li></ul><p class="mt-[1em] first:mt-0">‎However, we object that:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎For any given argument, it is less clear from local context whether it is positional or named. The <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code> could easily be missed in a long argument list and named arguments may be read as positional or vice versa.</p></li><li><p class="mt-[1em] first:mt-0">‎It is unclear whether keyword arguments for which the value was not elided may follow the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code>. If so, then their relative position will be inconsistent but if not, then an arbitrary grouping is enforced between different types of keyword arguments and reordering would be necessary if only one name was changed.</p></li><li><p class="mt-[1em] first:mt-0">‎The use of <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code> in function calls is established and this proposal would introduce a new effect which could cause confusion. For example, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a, *x, y)</code> would mean something different than <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a, *, x, y)</code>.</p></li></ul><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(=x)</code></h3><p class="mt-[1em] first:mt-0">‎In favour of this form:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎The prefix operator is more similar to the established <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*args</code> and <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎**kwargs</code> syntax for function calls.</p></li><li><p class="mt-[1em] first:mt-0">‎It draws more attention to itself when arguments are arranged vertically. In particular, if the arguments are of different lengths it is harder to find the equal sign at the end. Moreover, since Python is read left to right, the use of this feature is clearer to the reader earlier on.</p></li></ul><p class="mt-[1em] first:mt-0">‎On the contrary:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎While the prefix version is visually louder, in practice, there is no need for this feature to shout its presence any more than a typical named argument. By the time we read to the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎=</code> it is clear that the value is filled in automatically just as the value is clear in the typical keyword argument case.</p></li><li><p class="mt-[1em] first:mt-0">‎Semantically, this form communicates ‘here is a value, fill in the parameter’ which is not what we want to convey.</p></li><li><p class="mt-[1em] first:mt-0">‎It is less similar to f-string syntax.</p></li><li><p class="mt-[1em] first:mt-0">‎It is less obvious that arbitrary expressions are invalid, e.g. <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(=a + b)</code>.</p></li></ul><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(%x)</code> or <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(:x)</code> or <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(.x)</code></h3><p class="mt-[1em] first:mt-0">‎Several flavours of this syntax have been proposed with the prefix form substituting another character for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎=</code>. However, no such form has gained traction and the choice of symbol seems arbitrary compared to <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎=</code>. Additionally, there is less precedent in terms of existing language features (such as f-string) or other languages (such as Ruby).</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Objections</h2><p class="mt-[1em] first:mt-0">‎There are only a few hard objections to the introduction of this syntactic sugar. Most of those not in favour of this feature are in the camp of ‘I wouldn’t use it’. However, over the extensive conversations about this feature, the following objections were the most common:</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎The syntax is ugly</h3><p class="mt-[1em] first:mt-0">‎This objection is by far the most common. On the contrary, we argue that:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎This objection is subjective and many community members disagree.</p></li><li><p class="mt-[1em] first:mt-0">‎A nearly-identical syntax is already established for f-strings.</p></li><li><p class="mt-[1em] first:mt-0">‎Programmers will, as ever, adjust over time.</p></li></ul><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎The feature is confusing</h3><p class="mt-[1em] first:mt-0">‎We argue that:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎Introducing new features typically has this impact temporarily.</p></li><li><p class="mt-[1em] first:mt-0">‎The syntax is very similar to the established <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f\'{x=}\'</code> syntax.</p></li><li><p class="mt-[1em] first:mt-0">‎The feature and syntax are familiar from other popular modern languages.</p></li><li><p class="mt-[1em] first:mt-0">‎The expansion of <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=</code> to <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=x</code> is in fact a trivial feature and inherently significantly less complex than <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*arg</code> and <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎**kwarg</code> expansion.</p></li><li><p class="mt-[1em] first:mt-0">‎This particular syntactic form has been independently proposed on numerous occasions, indicating that it is the most obvious <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id13">[1]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id14">[2]</a> <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline footnote-reference brackets" href="https://peps.python.org/pep-0736/#id18">[6]</a>.</p></li></ul><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎The feature is not explicit</h3><p class="mt-[1em] first:mt-0">‎We recognise that, in an obvious sense, the argument value is ‘implicit’ in this proposed syntax. However, we do not think that this is what the Zen of Python is aiming to discourage.</p><p class="mt-[1em] first:mt-0">‎In the sense that we take the Zen to be referring to, keyword arguments (for example) are more explicit than positional arguments where the argument name is omitted and impossible to tell from the local context. Conversely, the syntactic sugar for integers <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x += 1</code> is not more implicit than <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x = x + 1</code> in this sense, even though the variable is omitted from the right hand side, because it is immediately obvious from the local context what it is.</p><p class="mt-[1em] first:mt-0">‎The syntax proposed in this RFC is much more closely analogous to the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x += 1</code> example (although simpler since we do not propose to introduce a new operation). Moreover, the introduction of this syntactic sugar should encourage the use of keyword arguments over positional ones, making typical Python codebases more explicit in general.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎The feature adds another way of doing things</h3><p class="mt-[1em] first:mt-0">‎The same argument can be made against all syntax changes. This is a simple syntactic sugar, much as <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x += 1</code> is sugar for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x = x + 1</code> when <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x</code> is an integer. This isn’t tantamount to a ‘new way’ of passing arguments but a more readable notation for the same way.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Renaming the variable in the calling context will break the code</h3><p class="mt-[1em] first:mt-0">‎A <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎NameError</code> would make the mistake clear in most cases. There may be confusion if a variable from a broader scope has the same name as the original variable, so no <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎NameError</code> would be raised. However, this issue can also occur with keyword arguments using the current syntax (arguably, this syntactic sugar could make it harder to spot). Moreover, having variables with the same name in different scopes is broadly considered bad practice and discouraged by linters.</p><p class="mt-[1em] first:mt-0">‎Code editors could highlight the issue based on static analysis - <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=)</code> is exactly equivalent to writing <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code>. If <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x</code> does not exist, modern editors have no problem highlighting the issue.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎This syntax increases coupling</h3><p class="mt-[1em] first:mt-0">‎We recognise that, as ever, all syntax has the potential for misuse and so should be applied judiciously to improve codebases. In this case, if a parameter and its value have the same semantics in both contexts, that may suggest that using this new syntax is appropriate and will help ameliorate the risk of unintentional desynchronisation which harms readability.</p><p class="mt-[1em] first:mt-0">‎However, if the two variables have different semantics, that may suggest that this feature should not be used to encourage consistency or even that they should be renamed.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Recommendations for using this syntax</h2><p class="mt-[1em] first:mt-0">‎As with any other language feature, the programmer should exercise their own judgement about whether it is prudent to use it in any given context. We do not recommend enforcing a rule to use the feature in all cases where it may be applicable.</p><p class="mt-[1em] first:mt-0">‎As described <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://peps.python.org/pep-0736/Thissyntaxincreasescoupling">above</a>, we propose that a reasonable rule of thumb would be to use this in cases where a parameter and its argument have the same semantics in order to reduce unintentional desynchronisation without causing inappropriate coupling.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Impact on editing</h2><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Using a plain text editor</h3><p class="mt-[1em] first:mt-0">‎Editing with a plain text editor should generally be unaffected.</p><p class="mt-[1em] first:mt-0">‎When renaming a variable using a ‘Find-Replace’ method, where this syntax is used the developer will come across the function argument at invocation (as they would if this syntax was not used). At that point, they can as usual decide whether to update the argument as well or expand to the full <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code> syntax.</p><p class="mt-[1em] first:mt-0">‎As with the current syntax, a ‘Find-Replace All’ method would fail since the keyword argument would not exist at function definition, in the vast majority of cases.</p><p class="mt-[1em] first:mt-0">‎If the developer leaves the argument name unchanged and forgets to update its value, a <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎NameError</code> will typically be raised as described <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://peps.python.org/pep-0736/Renamingthevariableinthecallingcontextwillbreakthecode">above</a>.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Proposals for IDEs</h3><p class="mt-[1em] first:mt-0">‎In response to community feedback, we include some suggestions regarding how IDEs could handle this syntax. However, we of course defer to the domain experts developing IDEs to use their own discretion.</p><p class="mt-[1em] first:mt-0">‎Most considerations are made simple by recognising that <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=)</code> is just syntactic sugar for <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code> and should be treated the same as at present.</p><p class="mt-[1em] first:mt-0">‎Highlighting NameErrors</p><p class="mt-[1em] first:mt-0">‎IDEs typically offer a feature to highlight code that may cause a <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎NameError</code>. We recommend that this syntax be treated similarly to the expanded form <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code> to identify and highlight cases where the elided value variable may not exist. What visual cue may be used to highlight these cases may be the same or different from that which would be used with the current syntax, depending on the IDE.</p><p class="mt-[1em] first:mt-0">‎Jump to definition</p><p class="mt-[1em] first:mt-0">‎There are a few possible ways that a ‘jump to definition’ feature could be implemented depending on the caret/cursor position.</p><p class="mt-[1em] first:mt-0">‎One option is to:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎Jump to the argument in the function definition if the caret/cursor is on the argument</p></li><li><p class="mt-[1em] first:mt-0">‎Jump to the definition of the elided variable if the caret/cursor is on the character following the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎=</code> in our proposed syntax.</p></li></ul><p class="mt-[1em] first:mt-0">‎Another, potentially complementary, option would be to expand the syntax visually on mouseover and enable a <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎Ctrl+Click</code> (or <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎Cmd+Click</code>) to the definition of the variable.</p><p class="mt-[1em] first:mt-0">‎Rename symbol</p><p class="mt-[1em] first:mt-0">‎There are a few ways that IDEs may wish to support a ‘Rename symbol’ feature for this syntax. For example, if the argument is being renamed, the IDE may:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎Also rename the variable used as its value in each calling context where this syntax is used</p></li><li><p class="mt-[1em] first:mt-0">‎Expand to use the full syntax to pass the variable used as its value</p></li><li><p class="mt-[1em] first:mt-0">‎Prompt the developer to select between the two above options</p></li></ul><p class="mt-[1em] first:mt-0">‎The last option here seems most preferable in order to reduce unintentional desynchronisation of names while highlighting the user to the changes.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Reference Implementation</h2><p class="mt-[1em] first:mt-0">‎<a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline reference external" href="https://github.com/Hels15/cpython/tree/last-build">A proposed implementation</a> for cpython has been provided by @Hels15.</p>',
    highlights: [
      {
        highlight_id: 0,
        start: "/p[7]/text()[1]",
        startOffset: 1,
        end: "/p[7]/text()[1]",
        endOffset: 134,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 1,
        _id: {
          $oid: "667a843fc208323a54878527",
        },
      },
      {
        highlight_id: 1,
        start: "/p[9]/text()[1]",
        startOffset: 1,
        end: "/p[9]/text()[1]",
        endOffset: 304,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 2,
        _id: {
          $oid: "667a843fc208323a54878528",
        },
      },
      {
        highlight_id: 2,
        start: "/p[8]/text()[1]",
        startOffset: 1,
        end: "/p[8]/text()[1]",
        endOffset: 89,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 3,
        _id: {
          $oid: "667a843fc208323a54878529",
        },
      },
      {
        highlight_id: 3,
        start: "/p[12]/text()[1]",
        startOffset: 1,
        end: "/p[12]/text()[4]",
        endOffset: 116,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 4,
        _id: {
          $oid: "667a843fc208323a5487852a",
        },
      },
      {
        highlight_id: 4,
        start: "/h2[8]/text()[1]",
        startOffset: 1,
        end: "/h2[8]/text()[1]",
        endOffset: 10,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 5,
        _id: {
          $oid: "667a843fc208323a5487852b",
        },
      },
      {
        highlight_id: 5,
        start: "/h2[9]/text()[1]",
        startOffset: 1,
        end: "/h2[9]/text()[1]",
        endOffset: 14,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 6,
        _id: {
          $oid: "667a843fc208323a5487852c",
        },
      },
      {
        highlight_id: 6,
        start: "/h3[10]/text()[1]",
        startOffset: 1,
        end: "/h3[10]/text()[1]",
        endOffset: 25,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 7,
        _id: {
          $oid: "667a843fc208323a5487852d",
        },
      },
      {
        highlight_id: 7,
        start: "/p[35]/text()[1]",
        startOffset: 1,
        end: "/p[35]/text()[1]",
        endOffset: 275,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 8,
        _id: {
          $oid: "667a843fc208323a5487852e",
        },
      },
      {
        highlight_id: 8,
        start: "/h3[6]/code[1]/text()[1]",
        startOffset: 1,
        end: "/h3[6]/code[1]/text()[1]",
        endOffset: 14,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: 19,
        _id: {
          $oid: "667a843fc208323a5487852f",
        },
      },
    ],
    comments: [
      {
        comment_id: 0,
        thread_id: 0,
        user_name: "Isabella Jenkins",
        content:
          '<p class="mt-[1em] first:mt-0">‎This is a discussion thread for <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://peps.python.org/pep-0736/"><u>RFC 042</u></a> which is currently in draft.</p><p class="mt-[1em] first:mt-0">‎Previous threads have generated a lot of conversation already so it would be really appreciated if you could read the RFC and previous discussion before contributing and confirm whether your suggestion has already been addressed satisfactorily.</p><p class="mt-[1em] first:mt-0">‎Thanks so much to everyone who has contributed their thoughts so far. Some minor suggestions have been omitted from this post for brevity but if you feel I’m missing a critical point that was previously made, please send a Discuss message.</p><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Noted RFC feedback</h2><p class="mt-[1em] first:mt-0">‎The following feedback on the RFC itself has been noted and I will do my best to address it in a subsequent edit:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎Clarify our response to ‘explicit is better than implicit’ objection</p></li><li><p class="mt-[1em] first:mt-0">‎Address the balance of coupling semantically distinct variables vs avoiding desynchronising semantically equivalent ones</p></li><li><p class="mt-[1em] first:mt-0">‎Explain the impact on editing code and IDEs</p></li></ul><h2 class="text-xl font-semibold mt-[1.5em] first:mt-0">‎Ongoing discussion</h2><p class="mt-[1em] first:mt-0">‎The publication of the RFC sparked a few conversations on <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/304"><u>the previous thread</u></a>. I’ll mention them and give my own current take here, but if you have substantive contributions which will further the discussion on these points, please do offer them here.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Chosen syntax</h3><p class="mt-[1em] first:mt-0">‎Much of the previous discussion has centred on the particular syntax chosen for the RFC. The most common alternative proposal is <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x, *, y)</code>. I think this is the strongest alternative that has been proposed as it closely resembles the keyword-only syntax of function definitions and it was the second most popular in <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/130"><u>the poll</u></a>.</p><p class="mt-[1em] first:mt-0">‎I’m not personally wedded to the syntax presented in the RFC (indeed that syntax is different from the one I originally proposed). However, so far, I haven’t seen any concrete benefits of any alternative which are not already described in the RFC, instead most of the emphasis is on stylistic preference. The weight of merits as presented in the RFC still seem stronger for the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=)</code> syntax.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Debate on adherence to ‘explicit is better than implicit’</h3><p class="mt-[1em] first:mt-0">‎I recognise that the explanation given in the RFC is inadequate and that it is true that, in an obvious sense, the argument value is ‘implicit’ in our proposed syntax. However, I do not think that this is what the Zen of Python is trying to discourage.</p><p class="mt-[1em] first:mt-0">‎In the sense that I take the Zen to be referring to, keyword arguments (for example) are objectively more explicit than positional arguments where the argument name is omitted and impossible to tell from the local context. Conversely, the syntactic sugar for integers <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x += 1</code> is not more implicit than <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x = x + 1</code> in this sense, even though the variable is omitted from the right hand side, because it is immediately obvious from the local context what it is. The syntax proposed in this RFC is much more analogous to the second example, and is designed in part to encourage use of keyword arguments which are more explicit than positional ones.</p><p class="mt-[1em] first:mt-0">‎I’m unconvinced that we’re going to make any more progress on this so I’d not recommend much more discussion on this area. I will edit the RFC to be clearer.</p><h3 class="text-lg font-semibold mt-[1.5em] first:mt-0">‎Overall merits and potential for misuse</h3><p class="mt-[1em] first:mt-0">‎As ever, all syntax has the potential for misuse and so should be used judiciously. In this case, if a parameter and its value have the same semantics in both contexts, that may suggest that using this new syntax is appropriate. If not, that may suggest that they should have different names. Our analysis of popular repos showed that the former is at least very common.</p><p class="mt-[1em] first:mt-0">‎The status quo in Python encourages developers (e.g., me, at a minimum) to use shorter and less descriptive names to save keystrokes or use positional arguments to reduce visual clutter. We argue that this new syntax presents a valuable nudge towards use of keyword arguments and will ameliorate the risk of desynchronisation of semantically equivalent variables in different contexts which harms readability. Whether the risk of misuse outweighs the benefits of the proposed syntax enumerated in the RFC (the degree of which is hard to measure, as with any hypothetical change) is a judgement for the SC to make. I’m open to suggestions of objective evidence that could help shed light on this.</p>',
        created_on: 1719235071332,
        highlights: [],
        is_conclusion: false,
        _id: {
          $oid: "667971ff8192d380d39d3df3",
        },
      },
      {
        comment_id: 1,
        thread_id: 0,
        user_name: "Thomas Anderson",
        content:
          '<p class="mt-[1em] first:mt-0">‎I like the idea. Functions with many keyword arguments are common in lots of real-world Python code, and this will help make calls a little less verbose and therefore easier for humans to understand.</p><p class="mt-[1em] first:mt-0">‎The proposed syntax is good because it marks each individual keyword argument clearly. The alternative <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(*, a, b)</code> syntax would make it harder to see at a glance that <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎a</code> is this new special kind of keyword argument.</p><p class="mt-[1em] first:mt-0">‎I would caution against arguing too much on what exactly the Zen of Python should have to say here. The Zen is useful for each of us to think about as we consider changes to the language, but it’s inherently open to interpretation, and nobody is going to convince anyone by arguing over that interpretation.</p>',
        created_on: 1719235152493,
        highlights: [
          {
            highlight_id: 0,
            start: "/p[3]/text()[1]",
            startOffset: 1,
            end: "/p[3]/text()[1]",
            endOffset: 100,
            thread_id: 0,
            comment_id: 1,
            to_thread_id: 9,
            _id: {
              $oid: "667a843fc208323a5487851e",
            },
          },
        ],
        is_conclusion: false,
        _id: {
          $oid: "667972508192d380d39d3df8",
        },
      },
      {
        comment_id: 2,
        thread_id: 0,
        user_name: "Tom Watson",
        content: "",
        created_on: 1719236611604,
        highlights: [],
        is_conclusion: false,
        for_child_thread_created: true,
        for_child_thread_created_parent_comment_id: 1,
        for_child_thread_created_quote:
          "‎I would caution against arguing too much on what ex...",
        _id: {
          $oid: "667978138192d380d39d403d",
        },
      },
      {
        comment_id: 3,
        thread_id: 0,
        user_name: "Emma Nelson",
        content:
          '<p class="mt-[1em] first:mt-0">‎This is my first time seeing the proposal, and in general it’s an idea that I like (I implemented a similar concept in my own language a decade ago). I have two concerns:</p><ol class="list-decimal ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎The <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=, y=,</code> syntax looks incomplete. I’d prefer to have <em>something</em> after the equals, like <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=*, y=*</code> or even <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=..., y=...</code> (though I do appreciate that <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=</code> matches the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f"{x=}" --&gt; f"x={x}"</code> transform)</p></li><li><p class="mt-[1em] first:mt-0">‎It makes editing code, and the implications of those edits, harder. This in on my mind because I watched a livestreamer today spend ages figuring out why her <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎{ authToken }</code> object in JavaScript worked, but <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎{ authToken2 }</code> did not. As much as I like the sugar, I like not-confusing-new-users even more.</p></li></ol>',
        created_on: 1719253306156,
        highlights: [
          {
            highlight_id: 0,
            start: "/ol[1]/li[1]/p[1]/text()[1]",
            startOffset: 1,
            end: "/ol[1]/li[1]/p[1]/text()[2]",
            endOffset: 25,
            thread_id: 0,
            comment_id: 3,
            to_thread_id: 17,
            _id: {
              $oid: "667a843fc208323a54878521",
            },
          },
          {
            highlight_id: 1,
            start: "/ol[1]/li[1]/p[1]/text()[4]",
            startOffset: 1,
            end: "/ol[1]/li[1]/p[1]/code[2]/text()[1]",
            endOffset: 13,
            thread_id: 0,
            comment_id: 3,
            to_thread_id: 18,
            _id: {
              $oid: "667a843fc208323a54878522",
            },
          },
        ],
        is_conclusion: false,
        _id: {
          $oid: "6679b93a048106ccb39df640",
        },
      },
      {
        comment_id: 4,
        thread_id: 0,
        user_name: "Elizabeth Ross",
        content: "",
        created_on: 1719253492844,
        highlights: [],
        is_conclusion: false,
        for_child_thread_created: true,
        for_child_thread_created_parent_comment_id: 3,
        for_child_thread_created_quote:
          "The ‎x=, y=, syntax looks incomplete....",
        _id: {
          $oid: "6679bb74048106ccb39dfcb8",
        },
      },
      {
        comment_id: 5,
        thread_id: 0,
        user_name: "Elizabeth Ross",
        content: "",
        created_on: 1719253522329,
        highlights: [],
        is_conclusion: false,
        for_child_thread_created: true,
        for_child_thread_created_parent_comment_id: 3,
        for_child_thread_created_quote: "or even ‎x=..., y=......",
        _id: {
          $oid: "6679bb74048106ccb39dfcb9",
        },
      },
      {
        comment_id: 6,
        thread_id: 0,
        user_name: "Olivia Stevenson",
        content:
          '<p class="mt-[1em] first:mt-0">‎In general I’m +1 on the idea. I find that repeating named arguments is a pattern that happens often when you have public APIs with similar signatures that defer to common utilities. And sometimes these functions have <em>a lot</em> of arguments.</p><p class="mt-[1em] first:mt-0">‎To the readability argument, I would add that vertical space is very important to me (much of my time is spent reading and browsing through code). That is the reason I oppose the use of Black wherever I can, because Black consumes vertical space like crazy and that makes reviewing code much harder. Besides the obvious advantage of less typing, being able to reduce vertical space through tighter packing of argument lists is a welcome improvement.</p><p class="mt-[1em] first:mt-0">‎I’m not fond of the proposed syntax but I agree there doesn’t seem to be a better alternative on the table. I would be ok with any of the following, or slight variations thereupon:</p><ul class="list-disc ml-8 mt-[1em] first:mt-0"><li><p class="mt-[1em] first:mt-0">‎<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(arg_name=)</code></p></li><li><p class="mt-[1em] first:mt-0">‎<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(=arg_name)</code></p></li><li><p class="mt-[1em] first:mt-0">‎<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(arg_name=&lt;)</code> (the sigil meaning “look to the left for the argument’s value”)</p></li></ul><p class="mt-[1em] first:mt-0">‎I also remember that the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎@</code> syntax for decorators was widely loathed when it was standardized, and years later everyone came to find it entirely ok.</p>',
        created_on: 1719293637105,
        highlights: [],
        is_conclusion: false,
        _id: {
          $oid: "667a56c5e1ecb0ef1b8bf165",
        },
      },
      {
        comment_id: 7,
        thread_id: 0,
        user_name: "Alex Brown",
        content:
          '<p class="mt-[1em] first:mt-0">‎I’m not sure if this has been mentioned before, but my main criticism of this RFC is that it’s too specific - that if a shorthand for homonymous parameters and variables is desired, it should come from splatting shorthand-form dicts, which the languages mentioned as inspiration in the RFC also possess, instead of introducing another function invocation variation. For example, Ruby’s shorthand call syntax draws directly from its implicit variable hash syntax; compare <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎{a:, b:}</code> with <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎c(a:, b:)</code>. (Ruby uses the same delimiter for both which does make things easier.) Counterintuitively, the proposed syntax would encourage using the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎dict</code> function instead of the more idiomatic dict literal for these cases. I find the implictness/confusion reservations unconvincing. Rather, I think this feature should be generalised to support a wider array of uses than it would if it were limited to keyword arguments. That splatting shorthand dicts should come at a greater cost than simply omitting the value should alleviate misuse/overuse concerns.</p>',
        created_on: 1719304989295,
        highlights: [],
        is_conclusion: false,
        _id: {
          $oid: "667a831ec208323a548780ee",
        },
      },
    ],
    threads: [
      {
        thread_id: 4,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 3,
        quote_by: "Isabella Jenkins",
        quote:
          'This syntax can be applied to dictionary construction where a similar pattern frequently occurs (where dictionary keys are identical the names of the variables assigned as their values), ‎{"x": x, "y": y} or ‎dict(x=x, y=y). With this feature, this can now also be trivially written as ‎dict(x=, y=). Whether to further support similar syntax in dictionary literals is an open question out of the scope of this RFC.',
        comments: [
          {
            comment_id: 0,
            thread_id: 4,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎This is the only benefit of the new syntax that I’d support. And while I do find having to type <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎dict(a=a, b=b)</code> annoying, it mostly only comes up at the REPL, or in throwaway code.</p>',
            created_on: 1719236374326,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d402f",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d402e",
        },
      },
      {
        thread_id: 9,
        from_thread_id: 0,
        from_comment_id: 1,
        from_highlight_id: 0,
        quote_by: "Thomas Anderson",
        quote:
          "‎I would caution against arguing too much on what exactly the Zen of Python should have to say here.",
        comments: [
          {
            comment_id: 0,
            thread_id: 9,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎100% agreed. IMO, the <em>reason</em> there’s been a debate over principles from the Zen like explicit vs implicit is because the proposal leans heavily on the Zen for its arguments. In particular, the “Encourages use of named variables” section uses “explicit is better than implicit” as a justification, so it’s hardly surprising if people with different interpretations disagree. Of course, without the Zen quote, that rationale becomes “it’s more readable”, which is clearly very subjective, so the whole argument in that sentence becomes less compelling (as I noted above)…</p>',
            created_on: 1719236627110,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d4039",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d4038",
        },
      },
      {
        thread_id: 5,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 4,
        quote_by: "Isabella Jenkins",
        quote: "Prior Art",
        comments: [
          {
            comment_id: 0,
            thread_id: 5,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎This <em>does</em> act as a good argument that this is simply following a common trend, and not inventing something unusual. If the RFC’s argument was simply “lots of other languages do this, why don’t we?” then I’d say this section would be compelling. But conversely, I don’t think that “doing something because other languages do it” has been a particularly successful argument for adding features in the past - in cases where we <em>have</em> done it (conditional expressions and assignment expressions come to mind) the features have been controversial, and have usually had strong justifications on their own merit.</p>',
            created_on: 1719236507815,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d4031",
            },
          },
          {
            comment_id: 1,
            thread_id: 5,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎I agree. “Other languages do this” is neither a strong argument for nor a strong argument against a proposal. However, prior art is always extremely useful to be aware of. What do other languages do? Can we get some opinions from people who use them? ESPECIALLY the case if a language used to have a feature but removed it, or if a clearly-derived language dropped the feature despite otherwise being similar.</p>',
            created_on: 1719236844814,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978ed8192d380d39d40b9",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d4030",
        },
      },
      {
        thread_id: 2,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 1,
        quote_by: "Isabella Jenkins",
        quote:
          "A common problem is that semantically identical variables have different names depending on their contexts. This syntax would encourage authors to use the same variable name when calling a function as the argument name, which would increase consistency of variable names used and hence also readability.",
        comments: [
          {
            comment_id: 0,
            thread_id: 2,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎This can just as easily be stated as “discourages context-appropriate variable names”. Take the example above again - a function to do a generalised motion calculation might well take a <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎velocity</code> argument. But in my code, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎vehicle_velocity</code> might be a more meaningful name. Which again puts us back in the “don’t do this if it’s not appropriate” debate, just in a different context.</p>',
            created_on: 1719236255889,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d402b",
            },
          },
          {
            comment_id: 1,
            thread_id: 2,
            user_name: "Isabella Jenkins",
            content:
              '<p class="mt-[1em] first:mt-0">‎True, this syntax may be misapplied and should be used judiciously as summarised in the thread description. I’ve added a note in the thread description to expand on the balance between risk of coupling vs benefit of synchronisation. I will consider specifically adding a recommendation in the RFC to use this syntax for variables that are semantically equivalent.</p>',
            created_on: 1719236994158,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797c458192d380d39d4468",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d402a",
        },
      },
      {
        thread_id: 7,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 6,
        quote_by: "Isabella Jenkins",
        quote: "The feature is confusing",
        comments: [
          {
            comment_id: 0,
            thread_id: 7,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎You haven’t addressed my point (from the original thread) that there are two <em>types</em> of confusion - the “initial unfamiliarity” type (which is the one that you address in this section) and the “inherent awkwardness” type (that you don’t address at all). Please re-read my post on this from the original thread, because I don’t think you’ve addressed it properly.</p>',
            created_on: 1719236561432,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d4035",
            },
          },
          {
            comment_id: 1,
            thread_id: 7,
            user_name: "Isabella Jenkins",
            content:
              '<p class="mt-[1em] first:mt-0">‎Thank you, I did miss <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/syntactic-sugar-to-encourage-use-of-named-arguments/36217/165"><u>your point there</u></a> and have dug into it more closely. Overall, I don’t think I agree that this is ‘confusing’ as opposed to a suggestion that some will find it ‘incongruent’ with the rest of Python syntax. It’s clear that you’re not the only one who feels this way. However, I think this comes down to a matter of the particular syntax selected rather than the feature itself. The RFC describes several proposed syntaxes, of which I’m open to any. That said, while hotly disputed, the weight of the arguments and broad support appears to be behind the syntax described in the RFC.</p>',
            created_on: 1719237565866,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797c458192d380d39d4473",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d4034",
        },
      },
      {
        thread_id: 10,
        from_thread_id: 8,
        from_comment_id: 0,
        from_highlight_id: 0,
        quote_by: "Tom Watson",
        quote:
          "this tightly couples variable names in the caller and parameter names in the callee.",
        comments: [
          {
            comment_id: 0,
            thread_id: 10,
            user_name: "Isabella Jenkins",
            content:
              '<p class="mt-[1em] first:mt-0">‎Yes, this feature should be used only where this effect is desirable. I will extend the RFC to emphasise this consideration as in the thread description.</p>',
            created_on: 1719237636428,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797c458192d380d39d4475",
            },
          },
        ],
        _id: {
          $oid: "66797c458192d380d39d4474",
        },
      },
      {
        thread_id: 8,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 7,
        quote_by: "Isabella Jenkins",
        quote:
          "‎There are only a few hard objections to the introduction of this syntactic sugar. Most of those not in favour of this feature are in the camp of ‘I wouldn’t use it’. However, over the extensive conversations about this feature, the following objections were the most common:",
        comments: [
          {
            comment_id: 0,
            thread_id: 8,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎You didn’t address the point that this tightly couples variable names in the caller and parameter names in the callee. Whether that’s a technical coupling (if I change the name of the local variable, I have to change the syntax used, not just rename the variable in the call as well) or “social” coupling (people are encouraged to use over-generic names in their code to match the arguments in APIs they use), it’s not really been addressed. There’s also the broader coupling, in the sense that it’s not possible to use this feature effectively for two APIs that don’t use the same argument names for something (for example, one API uses the name <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎colour</code> for an argument, and another API uses <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎color</code>).</p>',
            created_on: 1719236588252,
            highlights: [
              {
                highlight_id: 0,
                start: "/p[1]/text()[1]",
                startOffset: 35,
                end: "/p[1]/text()[1]",
                endOffset: 119,
                thread_id: 8,
                comment_id: 0,
                to_thread_id: 10,
                _id: {
                  $oid: "6679b8bb048106ccb39df582",
                },
              },
              {
                highlight_id: 1,
                start: "/p[1]/text()[2]",
                startOffset: 377,
                end: "/p[1]/text()[2]",
                endOffset: 492,
                thread_id: 8,
                comment_id: 0,
                to_thread_id: 11,
                _id: {
                  $oid: "6679b8bb048106ccb39df583",
                },
              },
              {
                highlight_id: 2,
                start: "/p[1]/text()[3]",
                startOffset: 1,
                end: "/p[1]/text()[5]",
                endOffset: 1,
                thread_id: 8,
                comment_id: 0,
                to_thread_id: 12,
                _id: {
                  $oid: "6679b8bb048106ccb39df584",
                },
              },
            ],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d4037",
            },
          },
          {
            comment_id: 1,
            thread_id: 8,
            user_name: "Isabella Jenkins",
            content: "",
            created_on: 1719237629600,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 0,
            for_child_thread_created_quote:
              "this tightly couples variable names in the caller an...",
            _id: {
              $oid: "66797c458192d380d39d447d",
            },
          },
          {
            comment_id: 2,
            thread_id: 8,
            user_name: "Isabella Jenkins",
            content: "",
            created_on: 1719237654538,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 0,
            for_child_thread_created_quote:
              "it’s not possible to use this feature effectively fo...",
            _id: {
              $oid: "66797c458192d380d39d447e",
            },
          },
          {
            comment_id: 3,
            thread_id: 8,
            user_name: "Isabella Jenkins",
            content: "",
            created_on: 1719237684686,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 0,
            for_child_thread_created_quote:
              "(for example, one API uses the name ‎colour for an a...",
            _id: {
              $oid: "66797c458192d380d39d447f",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d4036",
        },
      },
      {
        thread_id: 3,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 2,
        quote_by: "Isabella Jenkins",
        quote:
          "By minimising visual noise and in some cases lines of code, we can increase readability.",
        comments: [
          {
            comment_id: 0,
            thread_id: 3,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎This is highly subjective, IMO. The syntax is less verbose when it’s a direct replacement of <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎var=&lt;some_calculation&gt;; f(var=var)</code>, but it’s <em>not</em> less verbose when replacing <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(var=&lt;some_calculation&gt;)</code>, or <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎local_name=&lt;some_calculation&gt;; f(var=local_name)</code>, or many other situations. So it’s hard to see this as an independent advantage, as opposed to “if you are currently typing <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎var=var</code> in function calls, you can save a few keystrokes”. And simply “saving keystrokes” is widely acknowledged as a <em>very</em> weak argument in favour of a new feature.</p>',
            created_on: 1719236278013,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d402d",
            },
          },
          {
            comment_id: 1,
            thread_id: 3,
            user_name: "Isabella Jenkins",
            content:
              '<p class="mt-[1em] first:mt-0">‎I think this is also based on <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/pep-736-shorthand-syntax-for-keyword-arguments-at-invocation/43432/4"><u>the error in the RFC</u></a> that you identified. <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=x)</code> will always be more verbose than <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(x=)</code>. Yes, if you introduce a redundant variable it will become more verbose but the RFC was not intended to suggest that.</p>',
            created_on: 1719237027652,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797c458192d380d39d446b",
            },
          },
          {
            comment_id: 2,
            thread_id: 3,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎I <em>strongly</em> dispute the claim that the variable is redundant. Certainly it may sometimes be redundant - but so can any construct in Python (yes, I’m using your "any construct can be misused argument against you ) The point here is that if you have a <em>non-redundant</em> variable, the RFC is either more verbose or more likely inapplicable.</p><p class="mt-[1em] first:mt-0">‎No-one is arguing that not typing the second <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x</code> in <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=x</code> isn’t shorter. The argument is that shortening that case isn’t a worthwhile use of a language feature (i.e., “just because we can do a thing doesn’t mean we should”).</p>',
            created_on: 1719239239941,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679833b4d9eb167431fe16d",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d402c",
        },
      },
      {
        thread_id: 6,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 5,
        quote_by: "Isabella Jenkins",
        quote: "Applicability",
        comments: [
          {
            comment_id: 0,
            thread_id: 6,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎This section does establish that this is fairly common, and could immediately be used in quite a lot of places, in spite of the fact that I’m claiming that it’s often an anti-pattern. But I’m very unconvinced by the “lines saved” statistics, as I find that almost universally, collapsing a call into a smaller number of lines with multiple <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎var=</code> constructs per line is <em>less</em> readable. So the fact that formatters like <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎black</code> will do this without asking is overall (IMO) a net <em>loss</em> for the proposal, rather than a gain.</p>',
            created_on: 1719236532537,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d4033",
            },
          },
          {
            comment_id: 1,
            thread_id: 6,
            user_name: "Charlotte Lee",
            content:
              '<p class="mt-[1em] first:mt-0">‎Is this actually in the RFC somewhere? I didn’t see anything about formatters. I would be surprised if any formatter, and especially <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎black</code>, did such a transformation, especially because <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎black</code> keeps the same AST before and after formatting.</p><p class="mt-[1em] first:mt-0">‎I’m also -1 on the RFC, for the reasons @pf_moore stated. I don’t think it’s adding any expressiveness to the language.</p>',
            created_on: 1719236790947,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978b78192d380d39d4078",
            },
          },
          {
            comment_id: 2,
            thread_id: 6,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎Not explicitly, no. But in the “Applicability” section, one of the metrics quoted is “lines saved” based (presumably) on the idea that</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎some_func(\n    argument_one=argument_one,\n    argument_two=argument_two,\n    argument_three=argument_three,\n    argument_four=argument_four,\n)</code></pre><p class="mt-[1em] first:mt-0">‎could be converted into the “fewer lines” form</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎some_func(argument_one=, argument_two=, argument_three=, argument_four=)</code></pre><p class="mt-[1em] first:mt-0">‎My point isn’t that a formatter would decide to use the new syntax (which as you say changes the AST), but rather that if I chose to use the new syntax in the form</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎some_func(\n    argument_one=,\n    argument_two=,\n    argument_three=,\n    argument_four=,\n)</code></pre><p class="mt-[1em] first:mt-0">‎the formatter might choose to line-wrap it to the “shorter” form based on the implied “fewer lines” preference in the RFC, which I find significantly less readable. Basically, for function calls with many arguments, I prefer one argument per line as that makes the call easier to read (for me). Therefore, the new syntax would actually save <em>no</em> lines in my preferred style. And it might be another area where I find myself having to use <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎# fmt: off</code> to override formatters to get what I want.</p><p class="mt-[1em] first:mt-0">‎Of course, what formatters would do with this new syntax is unknown at this point, they may take the view that if a function call uses RFC 042 syntax, one argument per line is the preferred reformatting. Maybe this is something that the RFC should discuss? Although if the authors prefer not to get into such style matters, I can accept that.</p>',
            created_on: 1719236913315,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667979318192d380d39d40fc",
            },
          },
          {
            comment_id: 3,
            thread_id: 6,
            user_name: "Isabella Jenkins",
            content:
              '<p class="mt-[1em] first:mt-0">‎@pf_moore, I highly discourage formatters from applying this syntax globally by default for the agreed reasons. I’d be happy to add a suggestion in the RFC to think carefully before doing this.</p>',
            created_on: 1719237544240,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797c458192d380d39d4470",
            },
          },
          {
            comment_id: 4,
            thread_id: 6,
            user_name: "Charlotte Lee",
            content:
              '<p class="mt-[1em] first:mt-0">‎@pf_moore, Ah, got it. <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎black</code>, at least, controls this with “magic trailing commas”.</p><p class="mt-[1em] first:mt-0">‎But back on subject: I don’t think the RFC should concern itself with what formatters might do.</p>',
            created_on: 1719238335425,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797ec24d9eb167431fdee9",
            },
          },
          {
            comment_id: 5,
            thread_id: 6,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎@isabellajenkins, I think you’re misunderstanding my point (as @ericvsmith did). I’m not suggesting formatters convert <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=x</code> into <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=</code>. That’s a change in the code, not just a formatting change, and IMO it’s unacceptable for <em>any</em> formatter to do this. I was pointing out that there’s no clear “best” way to format calls that use RFC 042 format. But see below for more.</p>',
            created_on: 1719239365225,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679833b4d9eb167431fe177",
            },
          },
          {
            comment_id: 6,
            thread_id: 6,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎@ericvsmith, Agreed. But the RFC suggests (in the “applicability” section) that reducing line count by wrapping arguments is a benefit of the syntax. That’s just as much about what formatters might do (in terms of taking a stance on the “best” format). So let’s remove that as well</p>',
            created_on: 1719239450392,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679833b4d9eb167431fe178",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d4032",
        },
      },
      {
        thread_id: 13,
        from_thread_id: 11,
        from_comment_id: 1,
        from_highlight_id: 0,
        quote_by: "Tom Watson",
        quote:
          "I don’t think you can legitimately criticise two independent 3rd party libraries for not choosing the same argument name for a particular value (see my “color” vs “colour” example).",
        comments: [
          {
            comment_id: 0,
            thread_id: 13,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎Maybe, but at the same time, there are a huge number of places where they WILL use the same name, simply because it is the single most obvious name for something. When the concept is the same, the name will frequently be the same.</p>',
            created_on: 1719251465551,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679b38a048106ccb39df370",
            },
          },
        ],
        _id: {
          $oid: "6679b38a048106ccb39df36f",
        },
      },
      {
        thread_id: 11,
        from_thread_id: 8,
        from_comment_id: 0,
        from_highlight_id: 1,
        quote_by: "Tom Watson",
        quote:
          "it’s not possible to use this feature effectively for two APIs that don’t use the same argument names for something",
        comments: [
          {
            comment_id: 0,
            thread_id: 11,
            user_name: "Isabella Jenkins",
            content:
              '<p class="mt-[1em] first:mt-0">‎That’s fair but I don’t think that’s an issue with the proposal but an issue of inconsistency between the libraries used. If the developer owns the library in question, it indicates that they may want to update them for consistency. If there is a way to tweak the RFC to support this case, I’d love to consider it.</p>',
            created_on: 1719237658692,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797c458192d380d39d4477",
            },
          },
          {
            comment_id: 1,
            thread_id: 11,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎I don’t think you can legitimately criticise two independent 3rd party libraries for not choosing the same argument name for a particular value (see my “color” vs “colour” example). But you <em>can</em> criticise the RFC for ignoring that potential limit on its applicability. By all means say “we don’t care about that issue”, but don’t claim it’s a problem with the libraries.</p>',
            created_on: 1719239393938,
            highlights: [
              {
                highlight_id: 0,
                start: "/p[1]/text()[1]",
                startOffset: 1,
                end: "/p[1]/text()[1]",
                endOffset: 182,
                thread_id: 11,
                comment_id: 1,
                to_thread_id: 13,
                _id: {
                  $oid: "6679b8bb048106ccb39df599",
                },
              },
              {
                highlight_id: 1,
                start: "/p[1]/text()[2]",
                startOffset: 1,
                end: "/p[1]/text()[3]",
                endOffset: 74,
                thread_id: 11,
                comment_id: 1,
                to_thread_id: 14,
                _id: {
                  $oid: "6679b8bb048106ccb39df59a",
                },
              },
            ],
            is_conclusion: false,
            _id: {
              $oid: "6679833b4d9eb167431fe170",
            },
          },
          {
            comment_id: 2,
            thread_id: 11,
            user_name: "Michael Peters",
            content: "",
            created_on: 1719251461555,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 1,
            for_child_thread_created_quote:
              "I don’t think you can legitimately criticise two ind...",
            _id: {
              $oid: "6679b38a048106ccb39df376",
            },
          },
          {
            comment_id: 3,
            thread_id: 11,
            user_name: "Michael Peters",
            content: "",
            created_on: 1719251490174,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 1,
            for_child_thread_created_quote:
              "But you can criticise the RFC for ignoring that pote...",
            _id: {
              $oid: "6679b38a048106ccb39df377",
            },
          },
        ],
        _id: {
          $oid: "66797c458192d380d39d4476",
        },
      },
      {
        thread_id: 12,
        from_thread_id: 8,
        from_comment_id: 0,
        from_highlight_id: 2,
        quote_by: "Tom Watson",
        quote:
          "(for example, one API uses the name ‎colour for an argument, and another API uses ‎color)",
        comments: [
          {
            comment_id: 0,
            thread_id: 12,
            user_name: "Isabella Jenkins",
            content:
              '<p class="mt-[1em] first:mt-0">‎Haha, I think you need to take that one up with Noah Webster!</p>',
            created_on: 1719237690474,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797c458192d380d39d4481",
            },
          },
          {
            comment_id: 1,
            thread_id: 12,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎Happy to do so. As someone born and living in England, I can confirm he’s wrong and <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎colour</code> is the correct spelling. Will you raise PRs on all the libraries that use <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎color</code>, or should I?</p>',
            created_on: 1719239481327,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679833b4d9eb167431fe17b",
            },
          },
          {
            comment_id: 2,
            thread_id: 12,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎Oh, you go ahead. They’ll fit in just fine alongside all the other drive-by PRs these projects get : )</p>',
            created_on: 1719251849369,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679b38a048106ccb39df37d",
            },
          },
        ],
        _id: {
          $oid: "66797c458192d380d39d4480",
        },
      },
      {
        thread_id: 14,
        from_thread_id: 11,
        from_comment_id: 1,
        from_highlight_id: 1,
        quote_by: "Tom Watson",
        quote:
          "But you can criticise the RFC for ignoring that potential limit on its applicability.",
        comments: [
          {
            comment_id: 0,
            thread_id: 14,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎Is it a problem for RFC 634 that match statements have only limited applicability, or is it a benefit that they are applicable in certain situations? Is it a problem for the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎__future__</code> directive that only certain features make sense to be governed that way? It’s not a criticism of a proposal that it does not make sweeping changes to every single Python program ever written. It does what it does, and where it doesn’t apply, the existing syntactic form is perfectly fine.</p>',
            created_on: 1719251570270,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679b38a048106ccb39df379",
            },
          },
          {
            comment_id: 1,
            thread_id: 14,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎Oh, actually: Has it been suggested to add this shortcut syntax also to match patterns? That does seem like a decent usecase. That is probably the context where <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎name=name</code> has been the most annoying to me.</p>',
            created_on: 1719252154659,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679b4bb048106ccb39df490",
            },
          },
          {
            comment_id: 2,
            thread_id: 14,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎I don’t think so, but it would be a perfectly logical extension. Technically that’s not a function call, so it would be its own grammatical change. I’d definitely be in favour of doing it there too though. Again, even though technically this is a completely separate scope, it makes enormous sense to use the same name on both sides.</p>',
            created_on: 1719253178324,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679b8bb048106ccb39df5ab",
            },
          },
        ],
        _id: {
          $oid: "6679b38a048106ccb39df378",
        },
      },
      {
        thread_id: 15,
        from_thread_id: 1,
        from_comment_id: 5,
        from_highlight_id: 0,
        quote_by: "Michael Peters",
        quote:
          "What I do have is data that disputes your claim that keyword arguments are “perfectly well encouraged now”.",
        comments: [
          {
            comment_id: 0,
            thread_id: 15,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎I did not make this claim. But realizing a problem and suggesting something that <em>might</em> be a solution does not solve a problem.</p>',
            created_on: 1719253419871,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679bb74048106ccb39dfc9d",
            },
          },
        ],
        _id: {
          $oid: "6679bb74048106ccb39dfc9c",
        },
      },
      {
        thread_id: 17,
        from_thread_id: 0,
        from_comment_id: 3,
        from_highlight_id: 0,
        quote_by: "Emma Nelson",
        quote: "The ‎x=, y=, syntax looks incomplete.",
        comments: [
          {
            comment_id: 0,
            thread_id: 17,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎That was my knee jerk reaction as well, but I got used to it. It might not be perfect, but none of the other proposals have looked better.</p>',
            created_on: 1719253497806,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679bb74048106ccb39dfcac",
            },
          },
        ],
        _id: {
          $oid: "6679bb74048106ccb39dfcab",
        },
      },
      {
        thread_id: 18,
        from_thread_id: 0,
        from_comment_id: 3,
        from_highlight_id: 1,
        quote_by: "Emma Nelson",
        quote: "or even ‎x=..., y=...",
        comments: [
          {
            comment_id: 0,
            thread_id: 18,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎Not an option because <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎...</code> is already a valid expression.</p>',
            created_on: 1719253529901,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679bb74048106ccb39dfcae",
            },
          },
        ],
        _id: {
          $oid: "6679bb74048106ccb39dfcad",
        },
      },
      {
        thread_id: 19,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 8,
        quote_by: "Isabella Jenkins",
        quote: "f(a, b, *, x)",
        comments: [
          {
            comment_id: 0,
            thread_id: 19,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎Oh, I am also against the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a,*,x,y)</code> proposal because it makes this: <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a,*x,y)</code> mean something completely different than this: <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a,*,x,y)</code>. What <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code> means in call argument lists is generally already established, and this now adds a subtlety different definition that is going to confuse people.</p>',
            created_on: 1719253875186,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679bb74048106ccb39dfcb0",
            },
          },
          {
            comment_id: 1,
            thread_id: 19,
            user_name: "Ethan Bailey",
            content:
              '<p class="mt-[1em] first:mt-0">‎Those mean two different things in a function signature–is that a big problem?</p><p class="mt-[1em] first:mt-0">‎I think omitting the standard whitespace in those examples makes them needlessly confusing.</p>',
            created_on: 1719292958822,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a541fe1ecb0ef1b8beda2",
            },
          },
          {
            comment_id: 2,
            thread_id: 19,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎I don’t think so? In a function signature it’s perfectly valid to replace <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎,*,</code> with <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎,*_,</code> (i.e. an unused variable name) and you don’t get any real change in behavior.</p><p class="mt-[1em] first:mt-0">‎Edit: Oh, I guess you do. But it doesn’t affect the later arguments.</p>',
            created_on: 1719293023526,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a5460e1ecb0ef1b8bee5d",
            },
          },
          {
            comment_id: 3,
            thread_id: 19,
            user_name: "Ethan Bailey",
            content:
              '<p class="mt-[1em] first:mt-0">‎I don’t think the function signature is a big problem either, but I was asking because it seems like it should be equivalently-okay in the function call.</p>',
            created_on: 1719293214793,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a551fe1ecb0ef1b8bef1a",
            },
          },
          {
            comment_id: 4,
            thread_id: 19,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎They mean different, but very much related, things. Whereas the proposal to do this at the call site would have them mean quite different things.</p>',
            created_on: 1719293539281,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a5664e1ecb0ef1b8bf099",
            },
          },
          {
            comment_id: 5,
            thread_id: 19,
            user_name: "Ethan Bailey",
            content:
              '<p class="mt-[1em] first:mt-0">‎Hm I don’t really see such a big difference in these two situations. In both cases, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code> has multiple roles, either capturing/unpacking or separating sections.</p><p class="mt-[1em] first:mt-0">‎<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎def f(a, *x, y)</code> means “<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x</code> captures args, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎y</code> is keyword-only”, and <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎def f(a, *, x, y)</code> means “<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x</code> and <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎y</code> are keyword-only”. Certainly related, but the <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code> is doing two rather different things.</p><p class="mt-[1em] first:mt-0">‎On the call side, <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a, *x, y=y)</code> means “unpack <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x</code> and and pass <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎y</code> by keyword” while <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a, *, x, y)</code> or <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a, *, x=x, y)</code> means “pass <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x</code> and <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎y</code> by keyword, potentially with shorthand”. Related but again the role of <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code> is pretty different in these two cases.</p><p class="mt-[1em] first:mt-0">‎To be clear, I don’t think any of the above code is <em>that</em> confusing, which is why I have no issue with this version as a possible syntax. More familiarity, combined with IDE support and decent error messages, would make this all work fine IMO.</p>',
            created_on: 1719293837781,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a578ee1ecb0ef1b8bf2e7",
            },
          },
        ],
        _id: {
          $oid: "6679bb74048106ccb39dfcaf",
        },
      },
      {
        thread_id: 21,
        from_thread_id: 16,
        from_comment_id: 3,
        from_highlight_id: 0,
        quote_by: "Daniel Wright",
        quote:
          "We had a problem at $work where two C++ libraries that used quaternions used different calling conventions, one used w, x, y, z and the other x, y, z, w. However, had I rendered inlay hints with clangd this wouldn’t have been an issue, so that’s an anecdote in favor of these kinds problems being solved with editor support.",
        comments: [
          {
            comment_id: 0,
            thread_id: 21,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎TBH I consider this very much on-topic! This is an excellent example of how proper use of kwargs might have made this a lot easier.</p><p class="mt-[1em] first:mt-0">‎It’s worth noting that, in languages with no kwarg support, it’s very common to pass a single mapping argument called “options” that does the same job. See for example the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://developer.mozilla.org/en-US/docs/Web/API/fetch"><u>fetch() function in JavaScript </u></a>, the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://pike.lysator.liu.se/generated/manual/modref/ex/predef_3A_3A/Process/Process/create.html"><u>Process.Process() constructor in Pike</u></a> (this is part of a hierarchy, where each level of the hierarchy responds to particular options and passes the rest on - in Python, this would have each one accept **kwargs in addition to its own args, and pass the spares on), and many other examples. It’s a bit less obvious that way, but the intent is still the same.</p>',
            created_on: 1719297559294,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a66a7b22d70319af33db8",
            },
          },
          {
            comment_id: 1,
            thread_id: 21,
            user_name: "Daniel Wright",
            content:
              '<p class="mt-[1em] first:mt-0">‎While keyword arguments probably would be nice in C++, all competent IDEs/language servers allow the option for inlay hints which essentially removes the need for them to help with readability</p><p class="mt-[1em] first:mt-0">‎ Quick note on inlay hints for those unaware</p><p class="mt-[1em] first:mt-0">‎Inlay hints for function calls is where the editor adds the name of the parameter in front of the given argument so</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎test(variable_a, variable_b)</code></pre><p class="mt-[1em] first:mt-0">‎becomes, with the things within <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎|</code>pipes<code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎|</code> added by the editor, for example</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎test(|a:| variable_a, |b:| variable_b)</code></pre><p class="mt-[1em] first:mt-0">‎In fact, it might be possible (but I’m not sure how likely it is) that people who use tens of positional arguments in function calls are using inlay hints, in which case the problem is solved for them. Doesn’t help much when reviewing code on Github perhaps, but it helps avoiding mistakes.</p><p class="mt-[1em] first:mt-0">‎The more I think about this the more I’m thinking that this is a tooling problem. (Even though I don’t think repeated tokens in a function call is a problem at all.)</p>',
            created_on: 1719298174326,
            highlights: [
              {
                highlight_id: 0,
                start: "/p[1]/text()[1]",
                startOffset: 56,
                end: "/p[1]/text()[1]",
                endOffset: 91,
                thread_id: 21,
                comment_id: 1,
                to_thread_id: 22,
                _id: {
                  $oid: "667a6d9db22d70319af34904",
                },
              },
            ],
            is_conclusion: false,
            _id: {
              $oid: "667a687fb22d70319af33f8f",
            },
          },
          {
            comment_id: 2,
            thread_id: 21,
            user_name: "Michael Peters",
            content: "",
            created_on: 1719298541923,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 1,
            for_child_thread_created_quote:
              "all competent IDEs/language servers...",
            _id: {
              $oid: "667a6a18b22d70319af34166",
            },
          },
        ],
        _id: {
          $oid: "667a66a7b22d70319af33db7",
        },
      },
      {
        thread_id: 16,
        from_thread_id: 1,
        from_comment_id: 5,
        from_highlight_id: 1,
        quote_by: "Michael Peters",
        quote:
          "‎Out of nearly 75,000 function calls, a mere 5000 use even a single keyword argument.",
        comments: [
          {
            comment_id: 0,
            thread_id: 16,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎I actually already had run this script and wrote modifications of it. Out of those function calls 65% only use 0 or 1 arguments. Are you going to argue that adding keyword arguments there is any kind of improvement?</p><p class="mt-[1em] first:mt-0">‎(I can’t actually replicate the exact number of 75000 calls locally because I don’t have a CPython clone right now, I am getting 55k. But I am not going to argue that either number is non-representative.)</p><p class="mt-[1em] first:mt-0">‎Just because a call don’t use kwargs doesn’t mean that using them there would make sense.</p>',
            created_on: 1719253453024,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679bb74048106ccb39dfcaa",
            },
          },
          {
            comment_id: 1,
            thread_id: 16,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎Ah, that’s actually something I hadn’t thought to check. Hmm. I’m not sure where the threshold of readability would be. What would you consider the point at which the number of arguments starts to make keywording them beneficial - and would that point change if the syntax were less verbose?</p>',
            created_on: 1719293432085,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a5664e1ecb0ef1b8bf093",
            },
          },
          {
            comment_id: 2,
            thread_id: 16,
            user_name: "Daniel Wright",
            content:
              '<p class="mt-[1em] first:mt-0">‎In any case, 0 argument functions definitely shouldn’t count, and I think most people would agree 1 argument functions should count too (unless the function name very bad but that’s another issue).</p>',
            created_on: 1719293750995,
            highlights: [
              {
                highlight_id: 0,
                start: "/p[1]/text()[1]",
                startOffset: 1,
                end: "/p[1]/text()[1]",
                endOffset: 198,
                thread_id: 16,
                comment_id: 2,
                to_thread_id: 20,
                _id: {
                  $oid: "667a843fc208323a548784f2",
                },
              },
            ],
            is_conclusion: false,
            _id: {
              $oid: "667a5737e1ecb0ef1b8bf220",
            },
          },
          {
            comment_id: 3,
            thread_id: 16,
            user_name: "Daniel Wright",
            content:
              '<p class="mt-[1em] first:mt-0">‎As to where the limit of readability lies, I think it’s highly dependent on the context. I don’t think most people (well, developers anyway) would struggle to figure out what the arguments to create_vector3(x, y, z) mean, nor their order, but other three-variable functions may be harder to reason about. A large part of this, I think, is familiarity with the code i question.</p><p class="mt-[1em] first:mt-0">‎I’m strongly against this proposal, I don’t think the repetition is a problem, and of you think writing extra characters is the problem then I suggest creating a tool that autocompletes keyword arguments for you. Maybe make it an extension to a language server?</p><p class="mt-[1em] first:mt-0">‎ A remark kinda OT</p><p class="mt-[1em] first:mt-0">‎Just as a side note, I do appreciate that using keyword arguments is better. We had a problem at $work where two C++ libraries that used quaternions used different calling conventions, one used w, x, y, z and the other x, y, z, w. However, had I rendered inlay hints with clangd this wouldn’t have been an issue, so that’s an anecdote in favor of these kinds problems being solved with editor support.</p>',
            created_on: 1719294112199,
            highlights: [
              {
                highlight_id: 0,
                start: "/p[4]/text()[1]",
                startOffset: 78,
                end: "/p[4]/text()[1]",
                endOffset: 402,
                thread_id: 16,
                comment_id: 3,
                to_thread_id: 21,
                _id: {
                  $oid: "667a843fc208323a548784f4",
                },
              },
            ],
            is_conclusion: false,
            _id: {
              $oid: "667a58a1e1ecb0ef1b8bf3b1",
            },
          },
          {
            comment_id: 4,
            thread_id: 16,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎@chrisangelico, 0-arg (~15%) for sure shouldn’t count.</p><p class="mt-[1em] first:mt-0">‎1-arg almost always shouldn’t count, but sometimes you have functions that take many keyword arguments and you are only overwriting one of them.</p><p class="mt-[1em] first:mt-0">‎But assuming postional-or-keyword, I think 3-arg is about upper limit (thinking of to pygame APIs for example: <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎pg.draw.line(surface, color, start, end, width)</code> is potentially not readable without keyword arguments).</p><p class="mt-[1em] first:mt-0">‎But it also depends on the function definition, which the script can’t really analyze with. (and I am not even sure if I could define a good general pattern or statistic to look for)</p>',
            created_on: 1719295201042,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a5ce1e1ecb0ef1b8bf549",
            },
          },
          {
            comment_id: 5,
            thread_id: 16,
            user_name: "Michael Peters",
            content: "",
            created_on: 1719296791095,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 2,
            for_child_thread_created_quote:
              "‎In any case, 0 argument functions definitely should...",
            _id: {
              $oid: "667a66a7b22d70319af33db5",
            },
          },
          {
            comment_id: 6,
            thread_id: 16,
            user_name: "Michael Peters",
            content: "",
            created_on: 1719297538528,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 3,
            for_child_thread_created_quote:
              "We had a problem at $work where two C++ libraries th...",
            _id: {
              $oid: "667a66a7b22d70319af33db6",
            },
          },
          {
            comment_id: 7,
            thread_id: 16,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎@chrisangelico, My gut instinct is about 4. And no, verbosity of the syntax would make no difference (because my instinct is basically that up to 3 arguments are easy to understand positionally).</p><p class="mt-[1em] first:mt-0">‎Also, many (in my experience, yours may vary) cases with smaller numbers of arguments that use keywords are more about being explicit in what you mean, rather than avoiding confusion over what argument matches which parameter. In something like <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎sorted(seq, key=&lt;something&gt;)</code>, the use of <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎key=</code> is to be clear that you’re specifying a key, and you’d never use the positional form in practice. For that sort of usage, I’d argue that <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎key=</code> (picking up a local variable called <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎key</code>) would defeat the object. Again, your opinion may differ.</p><p class="mt-[1em] first:mt-0">‎I’d suggest ignoring any cases of functions called with fewer than 5 parameters when analyzing this data, if you want a “gut feeling” suggestion.</p>',
            created_on: 1719298843091,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6b1bb22d70319af34257",
            },
          },
          {
            comment_id: 8,
            thread_id: 16,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎Well, five is one of the samples that I posted above, so that works out nicely! About half of all calls in the stdlib with 5+ arguments pass them <em>all</em> positionally. It’s very “gut feeling” though, and I don’t think there’s any way to precisely identify the useful threshold, beyond that it’s somewhere in that very rough range. It’s like the debates about line length - smart people will have different opinions, but most people agree that 30 characters is too short and 500 is too long.</p>',
            created_on: 1719298913904,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6b62b22d70319af34348",
            },
          },
          {
            comment_id: 9,
            thread_id: 16,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎I have to say I’m becoming confused as to the point of all this. Are you trying to suggest that all of those calls that pass all 5+ arguments positionally are going to be improved by using keyword arguments? How could you possibly make a broad generalisation like that?</p>',
            created_on: 1719299040846,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6be1b22d70319af34530",
            },
          },
          {
            comment_id: 10,
            thread_id: 16,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎No, I’m not, but I’m trying to get an idea of the extent to which keyword arguments are currently being used, in response to an earlier claim that keyword arguments don’t need any encouragement since they’re already perfectly well encouraged. Welcome to long threads and long tangents.</p>',
            created_on: 1719299250829,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6cb5b22d70319af34720",
            },
          },
        ],
        _id: {
          $oid: "6679bb74048106ccb39dfca9",
        },
      },
      {
        thread_id: 22,
        from_thread_id: 21,
        from_comment_id: 1,
        from_highlight_id: 0,
        quote_by: "Daniel Wright",
        quote: "all competent IDEs/language servers",
        comments: [
          {
            comment_id: 0,
            thread_id: 22,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎I frequently edit code in nano because I’m working on a remote server. Even for my regular work, I prefer a much lighter-weight editor than something like VS Code, and I use SciTE, which doesn’t have this feature. Nor does Idle. It strikes me as a bit elitist to demand that all programmers use full-power IDEs, especially since “full-power” is defined somewhat arbitrarily.</p><p class="mt-[1em] first:mt-0">‎I would love to hear from people who use 5+ positional arguments as to whether this one feature makes or breaks it for them, and if so, what they do when unable to use their standard IDE.</p>',
            created_on: 1719298583992,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6a18b22d70319af34168",
            },
          },
          {
            comment_id: 1,
            thread_id: 22,
            user_name: "Daniel Wright",
            content:
              '<p class="mt-[1em] first:mt-0">‎While I agree that IDEs tend to be cumbersome, language servers are typically not especially heavy to run, but they do require some setup. In any case, I don’t think it’s elitist to mention that this problem can be resolved with tools, especially since pylance, the ‘default’ language server of VS Code, the most popular code editor atm, <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://devblogs.microsoft.com/python/python-in-visual-studio-code-july-2022-release/#inlay-type-hints"><u>supports this feature </u></a>. One could just as easily spin it the other way, why should the language change because some terminal elitists can’t use the most common tool? But I don’t think discussing elitism is contributing to this discussion and will likely only make people upset, so I think we should stop that particular discussion.</p>',
            created_on: 1719298970559,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6b9bb22d70319af3443b",
            },
          },
          {
            comment_id: 2,
            thread_id: 22,
            user_name: "Emma Nelson",
            content:
              '<p class="mt-[1em] first:mt-0">‎IDLE does not support it, and realistically that’s the only one we could possibly use to justify a language design decision.</p><p class="mt-[1em] first:mt-0">‎I don’t think we should let any IDE features influence the language. It should be readable in B&amp;W plain text printed on a piece of paper, and then it will only be <em>more</em> readable elsewhere.</p><p class="mt-[1em] first:mt-0">‎The only exception I make here is that it should be easy to search for it in a search engine. “What does equals sign in a function call mean in Python” seems like a reasonable thing to expect, so it already meets that for me.</p>',
            created_on: 1719299166767,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6c62b22d70319af34627",
            },
          },
          {
            comment_id: 3,
            thread_id: 22,
            user_name: "Olivia Stevenson",
            content:
              '<p class="mt-[1em] first:mt-0">‎@jacobnilson, So how does this work for code reviews in the Github UI, for example? The argument that IDEs obsolete attempts at making programming languages more ergonomic has never held water.</p><p class="mt-[1em] first:mt-0">‎Even if your favorite text editor supports language servers (not everybody uses VSCode), language servers do not always work properly. pylance <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://github.com/microsoft/pylance-release/issues/674"><u>does not seem </u></a>to support Cython, for example, and it probably does not support extensions generated using other tools such as nanobind or PyO3.</p>',
            created_on: 1719299351933,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6d19b22d70319af3481b",
            },
          },
          {
            comment_id: 4,
            thread_id: 22,
            user_name: "Emma Nelson",
            content:
              '<p class="mt-[1em] first:mt-0">‎I think with type hinting becoming so big, nobody is ever going to try and introspect native modules anymore. Their developers will need to start producing type stub files to go with them. So it’s not about “not working properly” and more about a fundamental premise (“everything is fully typed”) that leads to this result.</p><p class="mt-[1em] first:mt-0">‎A syntactic change in pure Python code would obviously be supported.</p>',
            created_on: 1719299484483,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a6d9db22d70319af34919",
            },
          },
        ],
        _id: {
          $oid: "667a6a18b22d70319af34167",
        },
      },
      {
        thread_id: 1,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: 0,
        quote_by: "Isabella Jenkins",
        quote:
          "‎This syntax would encourage the use of named variables, thereby increasing readability and reducing bugs from argument transposition.",
        comments: [
          {
            comment_id: 0,
            thread_id: 1,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎I’m not clear what “named variables” is intended to mean here, but I don’t see why it’s less readable to say (for example) <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎velocity=distance/time</code> in a function call’s parameter list as opposed to saying <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎velocity=</code> coupled with an assignment <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎velocity=distance/time</code>. In fact, the latter is <em>less</em> readable, because you need to look elsewhere to find the value. And yes, I know you can say “don’t use the syntax in that case, then”. But that just reduces the argument to how often the construct <em>is</em> appropriate, and how frequently it will be misused by people who are, let’s say, “overenthusiastic” in their use of new features.</p>',
            created_on: 1719236236877,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667978138192d380d39d4029",
            },
          },
          {
            comment_id: 1,
            thread_id: 1,
            user_name: "Isabella Jenkins",
            content:
              '<p class="mt-[1em] first:mt-0">‎This is based on <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/pep-736-shorthand-syntax-for-keyword-arguments-at-invocation/43432/4"><u>an error in the RFC</u></a> that you identified. Encouraging use of named arguments (as the RFC should read) is important given the clear merits they offer over positional arguments. Current Python syntax penalises use of keyword arguments by introducing visual clutter.</p>',
            created_on: 1719236960134,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797c458192d380d39d4465",
            },
          },
          {
            comment_id: 2,
            thread_id: 1,
            user_name: "Tom Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎I disagree. Named arguments are perfectly well encouraged now. The benefits of clearly linking the argument name and the value are present now - arguably more so, as the RFC <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=</code> syntax <em>hides</em> (to an extent) the fact that this refers to the value in the local variable <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x</code>. Claiming that the existing syntax introduces “visual clutter” is simply restaing the (IMO extremely weak) argument that the RFC “reduces verbosity”. But of course there’s a lot of subjectivity to all this, so you may well disagree. I’m stating my objections so you can address them in the RFC, not to try to persuade you.</p>',
            created_on: 1719238416556,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "66797f114d9eb167431fdf52",
            },
          },
          {
            comment_id: 3,
            thread_id: 1,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎The vast majority of functions in Python have all of their parameters as keyword-or-positional. The vast majority of function <em>calls</em> in Python use positional arguments. Is this “well encouraged”, or is the extra verbosity of having to label every argument a barrier to usage?</p>',
            created_on: 1719250628446,
            highlights: [
              {
                highlight_id: 0,
                start: "/p[1]/text()[1]",
                startOffset: 1,
                end: "/p[1]/text()[2]",
                endOffset: 36,
                thread_id: 1,
                comment_id: 3,
                to_thread_id: 23,
                _id: {
                  $oid: "667a843fc208323a54878507",
                },
              },
            ],
            is_conclusion: false,
            _id: {
              $oid: "6679afe1048106ccb39df0f9",
            },
          },
          {
            comment_id: 4,
            thread_id: 1,
            user_name: "Elizabeth Ross",
            content:
              '<p class="mt-[1em] first:mt-0">‎Do you have any statistics, for example a survey, that this verbosity is the reason that the majority of programmers are not using keyword arguments? How do you know that this feature is going to change this?</p><p class="mt-[1em] first:mt-0">‎Or is this just based on your own opinions?</p><p class="mt-[1em] first:mt-0">‎I probably would not change my behavior at all based on the presences of this feature, except for rare cases where the IDE suggests it or something.</p>',
            created_on: 1719252070267,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "6679b4bb048106ccb39df48d",
            },
          },
          {
            comment_id: 5,
            thread_id: 1,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎No, I don’t have any survey. What I do have is data that disputes your claim that keyword arguments are “perfectly well encouraged now”. So this is based on statistical analysis of the Python standard library. You’re welcome to use the script on your own codebase, or any other large codebase, if you think the stats shown here are non-representative.</p><p class="mt-[1em] first:mt-0">‎Script: <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline inline-onebox" href="https://github.com/Rosuav/shed/blob/master/find_kwargs.py"><u>shed/find_kwargs.py at master · Rosuav/shed · GitHub</u></a><br>Usage: <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎python3 ~/shed/find_kwargs.py -q --no-test</code> from the CPython source directory (main branch s of today, 20240118).</p><p class="mt-[1em] first:mt-0">‎Result:</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎Total function calls: 73573\nCalls with any kwarg: 5257 7.15%\nMaximum kwargs count: 20\nCalls with any \'x=x\': 1028 1.40%\n - compared to kwarg: 1028 19.55%\nMaximum num of \'x=x\': 11\nTotal keyword params: 10288 0.14 per call\nNum params where x=x: 1616 15.71%\nTotal function defns: 17304\nFunction params: pos: 179 0.51%\nFunction params: kwd: 1160 3.30%\nFunction params: any: 32611 92.86%</code></pre><p class="mt-[1em] first:mt-0">‎Out of nearly 75,000 function calls, a mere 5000 use even a single keyword argument. Calls that have a mixture of positional and keyword arguments are counted in that, which means that thirteen out of fourteen function calls use entirely positional arguments. (I don’t have a way of identifying whether the functions being called are implemented in C or Python, though. That MAY make a difference, as it’s more work to implement keyword parameters in C.)</p><p class="mt-[1em] first:mt-0">‎This is true despite the fact that function definitions are, by and large, entirely compatible with keyword arguments. Just half a percent of all function parameters are positional-only, with the overwhelming majority being positional-or-keyword - not at all surprising, since that’s what you get if you don’t explicitly ask for something else.</p><p class="mt-[1em] first:mt-0">‎Does this count as “perfectly well encouraged”?</p>',
            created_on: 1719253090603,
            highlights: [
              {
                highlight_id: 0,
                start: "/p[1]/text()[1]",
                startOffset: 30,
                end: "/p[1]/text()[1]",
                endOffset: 137,
                thread_id: 1,
                comment_id: 5,
                to_thread_id: 15,
                _id: {
                  $oid: "667a843fc208323a5487850a",
                },
              },
              {
                highlight_id: 1,
                start: "/p[4]/text()[1]",
                startOffset: 1,
                end: "/p[4]/text()[1]",
                endOffset: 85,
                thread_id: 1,
                comment_id: 5,
                to_thread_id: 16,
                _id: {
                  $oid: "667a843fc208323a5487850b",
                },
              },
            ],
            is_conclusion: false,
            _id: {
              $oid: "6679b8bb048106ccb39df5a7",
            },
          },
          {
            comment_id: 6,
            thread_id: 1,
            user_name: "Elizabeth Ross",
            content: "",
            created_on: 1719253415422,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 5,
            for_child_thread_created_quote:
              "What I do have is data that disputes your claim that...",
            _id: {
              $oid: "6679bb74048106ccb39dfca7",
            },
          },
          {
            comment_id: 7,
            thread_id: 1,
            user_name: "Elizabeth Ross",
            content: "",
            created_on: 1719253444067,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 5,
            for_child_thread_created_quote:
              "‎Out of nearly 75,000 function calls, a mere 5000 us...",
            _id: {
              $oid: "6679bb74048106ccb39dfca8",
            },
          },
          {
            comment_id: 8,
            thread_id: 1,
            user_name: "Emma Nelson",
            content:
              '<p class="mt-[1em] first:mt-0">‎Just to bring it to mind, the whole idea <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/allow-identifiers-as-keyword-arguments-at-function-call-site-extension-of-pep-3102/31677/1"><u>started</u></a> with the common <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎x=x</code> usage, as seen in the <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://pytorch.org/docs/stable/_modules/torch/optim/sgd.html#SGD"><u>pytorch</u></a> library. Then we moved on to encouraging more keyword argument usage by suggesting a syntax sugar, as if they weren’t being used <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://discuss.python.org/t/allow-identifiers-as-keyword-arguments-at-function-call-site-extension-of-pep-3102/31677/28"><u>enough </u></a>. I am not following anymore.</p>',
            created_on: 1719294236041,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a591de1ecb0ef1b8bf47c",
            },
          },
          {
            comment_id: 9,
            thread_id: 1,
            user_name: "Ethan Bailey",
            content:
              '<p class="mt-[1em] first:mt-0">‎Reading through the thread linked there, I realized I did forget about one aspect of call syntax: after unpacking a parameter you can still pass additional positional arguments. So I understand better how the usage <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code> could be confusing, that wasn’t obvious to me before. I was already thinking that <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎f(a, *b, *, x, y)</code> would be necessary to combine unpacking and keyword-shorthand in one call, but it’s not pretty…</p>',
            created_on: 1719295623010,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a5e87e1ecb0ef1b8bf618",
            },
          },
          {
            comment_id: 10,
            thread_id: 1,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎Yeah, that’s why it’s confusing. A function call with <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*x</code> in the middle of it doesn’t change the significance of subsequent arguments; but a function definition with <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*x</code> in the middle of it does. Hence I describe them as different, but related. They use the same symbols precisely <em>because</em> their jobs are so similar (and parallel).</p>',
            created_on: 1719297702112,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a66a7b22d70319af33dc6",
            },
          },
          {
            comment_id: 11,
            thread_id: 1,
            user_name: "Ethan Bailey",
            content:
              '<p class="mt-[1em] first:mt-0">‎Ah, I was focused on comparing <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*x</code> in a function definition with <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*</code> (separator for keyword-only arguments). In a definition it can do two pretty different things, and that seems fine. I think it could do those two things in a call as well.</p>',
            created_on: 1719298030660,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a67efb22d70319af33ea9",
            },
          },
          {
            comment_id: 12,
            thread_id: 1,
            user_name: "Eve Taylor",
            content: "",
            created_on: 1719304808674,
            highlights: [],
            is_conclusion: false,
            for_child_thread_created: true,
            for_child_thread_created_parent_comment_id: 3,
            for_child_thread_created_quote:
              "‎The vast majority of functions in Python have all o...",
            _id: {
              $oid: "667a8270c208323a54877ed2",
            },
          },
        ],
        _id: {
          $oid: "667978138192d380d39d4028",
        },
      },
      {
        thread_id: 23,
        from_thread_id: 1,
        from_comment_id: 3,
        from_highlight_id: 0,
        quote_by: "Michael Peters",
        quote:
          "‎The vast majority of functions in Python have all of their parameters as keyword-or-positional. The vast majority of function calls in Python use positional arguments.",
        comments: [
          {
            comment_id: 0,
            thread_id: 23,
            user_name: "Eve Taylor",
            content:
              '<p class="mt-[1em] first:mt-0">‎Part of this has grown historically, as the separation into keyword-only arguments is relatively recent (at least in the sense of: “present in all commonly supported Python versions”). But it has several advantages from a usage and maintenance perspective – obviously not 100% of the time but still.</p><p class="mt-[1em] first:mt-0">‎As a concrete example, scikit-learn has <a target="_blank" rel="noopener nofollow ugc" class="text-[#797874] underline" href="https://scikit-learn-enhancement-proposals.readthedocs.io/en/latest/slep009/proposal.html"><u>moved </u></a>almost all their APIs to keyword-only usage – their functions tend to have lots of arguments, so it makes sense that they adopted this quickly. Other libraries (incl. e.g. SciPy) are cautiously considering the same thing (within reason; some APIs are positional by nature, but making all the optional bits kwarg-only is still desirable). Part of the reason these things take time is because we want to minimize breakage obviously, and it’s a fair bit of churn, though the end result is IMO worth it.</p>',
            created_on: 1719304815785,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a8270c208323a54877ed4",
            },
          },
          {
            comment_id: 1,
            thread_id: 23,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎Agreed; and I am of the opinion that this is the perfect default. Yes, there are a few situations where you really want something to be positional-only, and that’s now an option (which for a long time it wasn’t), but otherwise, allowing people to pass arguments by name is almost never a problem. (Almost. It’s a bit annoying when trying to map arguments to parameters, and it does mean that your parameter names are a part of your API, but otherwise not a problem to have the flexibility.)</p><p class="mt-[1em] first:mt-0">‎So if callers MAY use keyword arguments - and you have an example of changing that to kwonly, but examples of moving to posonly are quite rare - then why don’t they? Is it because it’s completely unnecessary? (Likely true for functions with small numbers of parameters, more dubious as that number increases.) Or is it because writing <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎open("some-file", mode="wb")</code> is more hassle than it’s worth? I suspect it’s frequently the latter, but there’s no easy way to know.</p>',
            created_on: 1719304873193,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a82aac208323a54877fdb",
            },
          },
        ],
        _id: {
          $oid: "667a8270c208323a54877ed3",
        },
      },
      {
        thread_id: 20,
        from_thread_id: 16,
        from_comment_id: 2,
        from_highlight_id: 0,
        quote_by: "Daniel Wright",
        quote:
          "‎In any case, 0 argument functions definitely shouldn’t count, and I think most people would agree 1 argument functions should count too (unless the function name very bad but that’s another issue).",
        comments: [
          {
            comment_id: 0,
            thread_id: 20,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎Yeah, it’s at 2-3 parameters that it gets into the grey area. I did a few runs.</p><p class="mt-[1em] first:mt-0">‎(Methodology note: Since <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*a, **kw</code> in a function call are shown in the AST as a single argument each, and you could have multiple of them, I took the simplest possible approach that seemed reasonably consistent and counted them as 1, and also counted them as 1 in function definitions. Since the last set of stats, I changed it so that <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*args</code> in a function definition counts as 1 additional positional-only parameter, and <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎**kwargs</code> as 1 additional keyword-only parameter, again because it’s simple and reasonable, if not perfect.)</p><pre class="bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0"><code>‎Statistics for functions with at least 2 parameters.\nTotal function calls: 22284\nCalls with any kwarg: 4571 20.51%\nMaximum kwargs count: 20\nCalls with any "x=x": 926 4.16%\n - compared to kwarg: 926 20.26%\nMaximum num of "x=x": 11\nTotal keyword params: 9602 0.43 per call\nNum params where x=x: 1514 15.77%\nTotal function defns: 9947\nFunction params: pos: 748 2.63%\nFunction params: kwd: 1696 5.96%\nFunction params: any: 26020 91.41%\n\nStatistics for functions with at least 3 parameters.\nTotal function calls: 7840\nCalls with any kwarg: 2793 35.62%\nMaximum kwargs count: 20\nCalls with any "x=x": 643 8.20%\n - compared to kwarg: 643 23.02%\nMaximum num of "x=x": 11\nTotal keyword params: 7549 0.96 per call\nNum params where x=x: 1199 15.88%\nTotal function defns: 4595\nFunction params: pos: 487 2.74%\nFunction params: kwd: 1506 8.48%\nFunction params: any: 15767 88.78%\n\nStatistics for functions with at least 5 parameters.\nTotal function calls: 1392\nCalls with any kwarg: 802 57.61%\nMaximum kwargs count: 20\nCalls with any "x=x": 218 15.66%\n - compared to kwarg: 218 27.18%\nMaximum num of "x=x": 11\nTotal keyword params: 3729 2.68 per call\nNum params where x=x: 624 16.73%\nTotal function defns: 900\nFunction params: pos: 67 1.19%\nFunction params: kwd: 772 13.66%\nFunction params: any: 4814 85.16%\n\nStatistics for functions with at least 10 parameters.\nTotal function calls: 44\nCalls with any kwarg: 19 43.18%\nMaximum kwargs count: 20\nCalls with any "x=x": 12 27.27%\n - compared to kwarg: 12 63.16%\nMaximum num of "x=x": 11\nTotal keyword params: 201 4.57 per call\nNum params where x=x: 61 30.35%\nTotal function defns: 53\nFunction params: pos: 1 0.15%\nFunction params: kwd: 160 24.32%\nFunction params: any: 497 75.53%</code></pre><p class="mt-[1em] first:mt-0">‎For function definitions, the proportions don’t materially change. I’m going to consider my original statements to be broadly supported by these numbers. The “any” category has now been skewed down a bit, since <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎*a, **kw</code> is adding to the other figures instead of being in their own (unshown) category, but even so, the overwhelming majority of function parameters are keyword-or-positional.</p><p class="mt-[1em] first:mt-0">‎For function calls, though, it’s a LOT less clear. Since there’s no way to know how many parameters the function <em>could</em> have taken, it’s hard to judge. I would still say that, by and large, positional parameters continue to be used. Even at the most extreme end of both sets of statistics (minimum 10), function definitions have 75% of kw/pos parameters, while more than half of all function calls use exclusively positional parameters. I will admit, though, that the Python standard library isn’t a great demonstration of ten-arg functions, given that there are just 53 definitions and 44 calls making up that data set!</p><p class="mt-[1em] first:mt-0">‎Using a more conservative minimum of 2 or 3, the stats remain heavily skewed in favour of positional args. Excluding 0-arg and 1-arg functions raised the kwarg fraction to 20%, but that’s still a pretty small proportion. Remember, this counts a call if even a single argument is passed by keyword, so something like <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎print(x, end="")</code> will count as a call that uses kwargs.</p>',
            created_on: 1719296806976,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a66a7b22d70319af33dac",
            },
          },
          {
            comment_id: 1,
            thread_id: 20,
            user_name: "Frederick Watson",
            content:
              '<p class="mt-[1em] first:mt-0">‎I would not analyze the Python Standard Library if looking to figure out what any sort of modern common coding practices are. The standard library as a whole is a pretty “horrible” body of very old code that we do not like to make changes to on purpose. <em>(it wakes the scary Rabbit)</em></p><p class="mt-[1em] first:mt-0">‎I’d probably try to select a diverse subset of modern projects that haven’t been around for more than a decade, if even five years, including application code and <em>perhaps</em> include some recently shared Jupyter or Colab notebooks.</p>',
            created_on: 1719305055831,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a8360c208323a548781ee",
            },
          },
          {
            comment_id: 2,
            thread_id: 20,
            user_name: "Michael Peters",
            content:
              '<p class="mt-[1em] first:mt-0">‎That’s perfectly reasonable. My script is available if anyone wants to run it on their own codebases, and I’m happy to take recommendations for corpuses of code to analyze.</p>',
            created_on: 1719305129399,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a83aac208323a548782fb",
            },
          },
          {
            comment_id: 3,
            thread_id: 20,
            user_name: "Olivia Stevenson",
            content:
              '<p class="mt-[1em] first:mt-0">‎Can you give a link to your script again?</p>',
            created_on: 1719305225503,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a840ac208323a5487840a",
            },
          },
          {
            comment_id: 4,
            thread_id: 20,
            user_name: "Emma Nelson",
            content:
              '<p class="mt-[1em] first:mt-0">‎Here it is.</p><blockquote class="border-l-[6px] border-[#b6b6b6] pl-[0.75rem] mt-[1em] first:mt-0"><p class="mt-[1em] first:mt-0">‎Script: <a target="_blank" rel="noopener noreferrer nofollow" class="text-[#797874] underline" href="https://github.com/Rosuav/shed/blob/master/find_kwargs.py"><u>shed/find_kwargs.py at master · Rosuav/shed · GitHub</u></a><br>Usage: <code class="bg-[#F9F9F9] text-neutral-700 p-0.5">‎python3 ~/shed/find_kwargs.py -q --no-test</code> from the CPython source directory (main branch s of today, 20240118).</p></blockquote>',
            created_on: 1719305277762,
            highlights: [],
            is_conclusion: false,
            _id: {
              $oid: "667a843fc208323a5487851b",
            },
          },
        ],
        _id: {
          $oid: "667a66a7b22d70319af33dab",
        },
      },
    ],
  },
  version2: {
    highlights: [],
    comments: [],
    threads: [],
  },
  __v: 0,
};
