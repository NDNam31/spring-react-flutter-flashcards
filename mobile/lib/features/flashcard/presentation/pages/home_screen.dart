import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../auth/presentation/pages/login_screen.dart';
import '../providers/deck_list_provider.dart';
import '../widgets/add_deck_dialog.dart';
import '../widgets/deck_card.dart';
import 'deck_detail_screen.dart';

/// Home Screen - Displays list of decks
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final deckListAsync = ref.watch(deckListProvider);
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Decks'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          // Sync button
          IconButton(
            icon: const Icon(Icons.cloud_upload),
            onPressed: () => _handleSync(context, ref),
            tooltip: 'Sync with server',
          ),
          // Refresh button
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.read(deckListProvider.notifier).refresh();
            },
            tooltip: 'Refresh',
          ),
          // Logout/Login button
          authState.when(
            data: (user) {
              if (user != null) {
                return PopupMenuButton<String>(
                  icon: const Icon(Icons.account_circle),
                  onSelected: (value) {
                    if (value == 'logout') {
                      _handleLogout(context, ref);
                    }
                  },
                  itemBuilder: (context) => [
                    PopupMenuItem(
                      enabled: false,
                      child: Text(
                        user.email,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    const PopupMenuDivider(),
                    const PopupMenuItem(
                      value: 'logout',
                      child: Row(
                        children: [
                          Icon(Icons.logout),
                          SizedBox(width: 8),
                          Text('Logout'),
                        ],
                      ),
                    ),
                  ],
                );
              } else {
                return IconButton(
                  icon: const Icon(Icons.login),
                  onPressed: () => _navigateToLogin(context),
                  tooltip: 'Login',
                );
              }
            },
            loading: () => const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            error: (_, __) => IconButton(
              icon: const Icon(Icons.login),
              onPressed: () => _navigateToLogin(context),
              tooltip: 'Login',
            ),
          ),
        ],
      ),
      body: deckListAsync.when(
        data: (decks) {
          if (decks.isEmpty) {
            return _buildEmptyState(context);
          }

          return RefreshIndicator(
            onRefresh: () async {
              await ref.read(deckListProvider.notifier).refresh();
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: decks.length,
              itemBuilder: (context, index) {
                final deck = decks[index];
                return DeckCard(
                  deck: deck,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => DeckDetailScreen(deck: deck),
                      ),
                    );
                  },
                  onDelete: () async {
                    final confirmed = await _showDeleteConfirmation(context, deck.title);
                    if (confirmed == true) {
                      await ref.read(deckListProvider.notifier).deleteDeck(deck.id);
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Deleted: ${deck.title}'),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      }
                    }
                  },
                );
              },
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              Text(
                'Error loading decks',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                error.toString(),
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  ref.read(deckListProvider.notifier).refresh();
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          _showAddDeckDialog(context, ref);
        },
        icon: const Icon(Icons.add),
        label: const Text('New Deck'),
        tooltip: 'Create new deck',
      ),
    );
  }

  /// Handle sync button press
  void _handleSync(BuildContext context, WidgetRef ref) async {
    final authState = ref.read(authProvider);
    
    authState.when(
      data: (user) {
        if (user == null) {
          // Not logged in - show dialog
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Login Required'),
              content: const Text(
                'You need to login to sync your data with the server.',
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Cancel'),
                ),
                FilledButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    _navigateToLogin(context);
                  },
                  child: const Text('Login'),
                ),
              ],
            ),
          );
        } else {
          // Logged in - trigger sync
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Row(
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                  SizedBox(width: 16),
                  Text('Syncing data...'),
                ],
              ),
              duration: Duration(seconds: 2),
            ),
          );
          
          // TODO: Call SyncService here
          // await ref.read(syncServiceProvider).sync();
          
          // For now, just refresh the list
          ref.read(deckListProvider.notifier).refresh();
        }
      },
      loading: () {},
      error: (_, __) {
        _navigateToLogin(context);
      },
    );
  }

  /// Handle logout
  void _handleLogout(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(authProvider.notifier).logout();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Logged out successfully'),
          ),
        );
      }
    }
  }

  /// Navigate to login screen
  void _navigateToLogin(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const LoginScreen(),
      ),
    );
  }

  /// Build empty state widget
  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.auto_stories_outlined,
            size: 120,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 24),
          Text(
            'No Decks Yet',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: Colors.grey[700],
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'Create your first deck to start learning!',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey[600],
                ),
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {
              _showAddDeckDialog(context, null);
            },
            icon: const Icon(Icons.add),
            label: const Text('Create Deck'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(
                horizontal: 32,
                vertical: 16,
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Show add deck dialog
  void _showAddDeckDialog(BuildContext context, WidgetRef? ref) {
    showDialog(
      context: context,
      builder: (context) => const AddDeckDialog(),
    );
  }

  /// Show delete confirmation dialog
  Future<bool?> _showDeleteConfirmation(BuildContext context, String deckTitle) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Deck'),
        content: Text(
          'Are you sure you want to delete "$deckTitle"? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: FilledButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
