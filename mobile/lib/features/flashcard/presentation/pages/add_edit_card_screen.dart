import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/card.dart' as domain;
import '../providers/card_list_provider.dart';

class AddEditCardScreen extends ConsumerStatefulWidget {
  final String deckId;
  final domain.Card? card; // null for add, non-null for edit

  const AddEditCardScreen({
    super.key,
    required this.deckId,
    this.card,
  });

  @override
  ConsumerState<AddEditCardScreen> createState() => _AddEditCardScreenState();
}

class _AddEditCardScreenState extends ConsumerState<AddEditCardScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _frontController;
  late final TextEditingController _backController;
  late final TextEditingController _exampleController;
  bool _isLoading = false;

  bool get _isEditing => widget.card != null;

  @override
  void initState() {
    super.initState();
    _frontController = TextEditingController(
      text: widget.card?.front ?? '',
    );
    _backController = TextEditingController(
      text: widget.card?.back ?? '',
    );
    _exampleController = TextEditingController(
      text: widget.card?.example ?? '',
    );
  }

  @override
  void dispose() {
    _frontController.dispose();
    _backController.dispose();
    _exampleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'),
        actions: [
          if (_isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                  ),
                ),
              ),
            ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Info card
            Card(
              color: Colors.blue.shade50,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Icon(
                      Icons.info_outline,
                      color: Colors.blue.shade700,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        _isEditing
                            ? 'Chỉnh sửa thông tin thẻ học tập'
                            : 'Tạo một thẻ học tập mới. Cả hai trường đều bắt buộc.',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.blue.shade900,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Front (Term) field
            Text(
              'Thuật ngữ (Mặt trước)',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _frontController,
              decoration: InputDecoration(
                hintText: 'Ví dụ: Hello',
                prefixIcon: const Icon(Icons.book),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[50],
                counterText: '${_frontController.text.length} ký tự',
              ),
              maxLines: 2,
              minLines: 1,
              textInputAction: TextInputAction.next,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Thuật ngữ không được để trống';
                }
                if (value.trim().length < 1) {
                  return 'Thuật ngữ phải có ít nhất 1 ký tự';
                }
                return null;
              },
              onChanged: (value) {
                setState(() {}); // Update counter
              },
            ),

            const SizedBox(height: 24),

            // Back (Definition) field
            Text(
              'Định nghĩa (Mặt sau)',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _backController,
              decoration: InputDecoration(
                hintText: 'Ví dụ: Xin chào',
                prefixIcon: const Icon(Icons.description),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[50],
                counterText: '${_backController.text.length} ký tự',
              ),
              maxLines: 4,
              minLines: 2,
              textInputAction: TextInputAction.next,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Định nghĩa không được để trống';
                }
                if (value.trim().length < 1) {
                  return 'Định nghĩa phải có ít nhất 1 ký tự';
                }
                return null;
              },
              onChanged: (value) {
                setState(() {}); // Update counter
              },
            ),

            const SizedBox(height: 24),

            // Example field (optional)
            Text(
              'Ví dụ (Tùy chọn)',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _exampleController,
              decoration: InputDecoration(
                hintText: 'Ví dụ: Hello, how are you? - Xin chào, bạn khỏe không?',
                prefixIcon: const Icon(Icons.lightbulb_outline),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[50],
                counterText: '${_exampleController.text.length} ký tự',
              ),
              maxLines: 3,
              minLines: 1,
              textInputAction: TextInputAction.done,
              onFieldSubmitted: (_) => _saveCard(),
              onChanged: (value) {
                setState(() {}); // Update counter
              },
            ),

            const SizedBox(height: 32),

            // Action buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _isLoading ? null : () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Hủy'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _saveCard,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Text(_isEditing ? 'Lưu thay đổi' : 'Thêm thẻ'),
                  ),
                ),
              ],
            ),

            // Preview section
            const SizedBox(height: 32),
            const Divider(),
            const SizedBox(height: 16),
            Text(
              'Xem trước',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 16),
            _buildPreviewCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildPreviewCard() {
    final front = _frontController.text.trim();
    final back = _backController.text.trim();
    final example = _exampleController.text.trim();

    if (front.isEmpty && back.isEmpty) {
      return Card(
        color: Colors.grey[100],
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Center(
            child: Text(
              'Nhập thông tin để xem trước',
              style: TextStyle(
                color: Colors.grey[500],
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
        ),
      );
    }

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (front.isNotEmpty) ...[
              Row(
                children: [
                  Icon(Icons.book, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 8),
                  const Text(
                    'Thuật ngữ',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                front,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
            if (front.isNotEmpty && back.isNotEmpty) ...[
              const SizedBox(height: 16),
              const Divider(height: 1),
              const SizedBox(height: 16),
            ],
            if (back.isNotEmpty) ...[
              Row(
                children: [
                  Icon(Icons.description, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 8),
                  const Text(
                    'Định nghĩa',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                back,
                style: const TextStyle(fontSize: 14),
              ),
            ],
            if (example.isNotEmpty) ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Icon(Icons.lightbulb_outline, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 8),
                  const Text(
                    'Ví dụ',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                example,
                style: TextStyle(
                  fontSize: 13,
                  fontStyle: FontStyle.italic,
                  color: Colors.grey[700],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Future<void> _saveCard() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final front = _frontController.text.trim();
      final back = _backController.text.trim();
      final example = _exampleController.text.trim();

      if (_isEditing) {
        // Update existing card
        await ref.read(cardListProvider(widget.deckId).notifier).updateCard(
              cardId: widget.card!.id,
              front: front,
              back: back,
              example: example.isEmpty ? null : example,
            );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Đã cập nhật thẻ'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.of(context).pop(true);
        }
      } else {
        // Create new card
        await ref.read(cardListProvider(widget.deckId).notifier).addCard(
              front: front,
              back: back,
              example: example.isEmpty ? null : example,
            );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Đã thêm thẻ mới'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.of(context).pop(true);
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
}
