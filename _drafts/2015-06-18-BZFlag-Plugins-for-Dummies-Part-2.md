In part 1 of this series, I explained how to configure your computer for plug-in development. In this part, I will be explaining how the basic structure of a plug-in works and we'll be writing our first plug-in for you to compile and load!

Before we get started, I will be using certain vocabulary that will be used throughout this series so do your best to learn it. I have done my best to use vocabulary that other developers will recognize but some vocabulary is far too simple so nontechnical people will be able to understand it. At the beginning of each chapter, I will have a glossary of simple terms or words that I will be using from here on out; more complicated topics will have their own sections dedicated to them so do not solely rely on the glossary. I am also expecting you to read this series in order as with any other book because everything will be cumulative.

## Glossary

* __BZFS__ - The BZFlag executable that runs a server for other players to connect to
* __"Instructions"__ - The things we will have a plug-in do; we define these instructions through code
* __Source code__ - The human readable instructions that defines what a plugin does
* __Compiling a plug-in__ - This means the process of converting the source code into instructions that a computer will understand
* __Installing a plug-in__ - This will mostly only apply to Linux systems. The process of saving the compiled plug-in to a system directory that BZFS can access easily
* __Loading a plug-in__ - When you tell BZFS to look for a plug-in, enable it, and have its instructions executed on a BZFlag server