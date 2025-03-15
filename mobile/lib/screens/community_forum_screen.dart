import 'package:flutter/material.dart';
import '../services/community_forum_service.dart';

class CommunityForumScreen extends StatefulWidget {
    @override
    _CommunityForumScreenState createState() => _CommunityForumScreenState();
}

class _CommunityForumScreenState extends State<CommunityForumScreen> {
    final CommunityForumService _forumService = CommunityForumService('https://api.righttechcentre.com');
    List<dynamic> posts = [];

    @override
    void initState() {
        super.initState();
        fetchPosts();
    }

    Future<void> fetchPosts() async {
        final data = await _forumService.getPosts();
        setState(() {
            posts = data;
        });
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text('Community Forum'),
            ),
            body: ListView.builder(
                itemCount: posts.length,
                itemBuilder: (context, index) {
                    return ListTile(
                        title: Text(posts[index]['content']),
                        subtitle: Text('Posted by ${posts[index]['user']['name']}'),
                    );
                },
            ),
        );
    }
}