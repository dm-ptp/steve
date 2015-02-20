# Steve

Simple node.js app to update a Github repo upon receipt of a web hook. Supports Github post-receive hooks as well as any manual/custom hooks that can follow a specific format (see below).

Getting Started
====

Install node.js, clone this repo, and set up your config in conf/steve.yaml. There is a sample config file (conf/steve.yaml.sample) in place that you can use as a template for your own.

Configuration
----

Each config element represents a single repo. Take this example:

```
%YAML 1.2
---

my_repo:
  path: '/path/to/my/repo'
  method: 'manual'
  branch: 'master'

my_other_repo:
  path: '/path/to/my/other/repo'
  method: 'puppet'
```

Here we've set up my\_repo, which is a standard github repo whose files are located at `/path/to/my/repo`, as well as my\_other\_repo which is managed by puppet in `/path/to/my/other/repo`. We want to make sure that all pulls in my\_repo are done in the master branch.

Here is a list of accepted config settings:

TODO: finish
