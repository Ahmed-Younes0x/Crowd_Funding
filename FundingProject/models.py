from django.db import models
from django.core.exceptions import ValidationError
from datetime import datetime

from django.urls import reverse
from Login.models import Custom_User
# Create your models here.


# class Project(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     title = models.CharField(max_length=255)
#     details = models.TextField()
#     total_target = models.DecimalField(max_digits=10, decimal_places=2) 
#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField()
#     owner = models.ForeignKey(Custom_User, on_delete=models.CASCADE,null=True)
#     images=models.ImageField()

#     def CheckDate(self):
#         if self.start_time >= self.end_time:
#             raise ValidationError("End time must be after start time.")

#     def save(self, *args, **kwargs):
#         self.CheckDate()
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.title}"
    
    
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='اسم الفئة')
    description = models.TextField(blank=True, null=True, verbose_name='الوصف')
    icon = models.CharField(max_length=50, default='Folder', verbose_name='الأيقونة')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')

    class Meta:
        verbose_name = 'فئة'
        verbose_name_plural = 'الفئات'
        ordering = ['name']

    def __str__(self):
        return self.name

class Project(models.Model):
    STATUS_CHOICES = [
        ('active', 'active'),
        ('completed', 'completed'),
        ('cancelled', 'cancelled'),
    ]

    title = models.CharField(max_length=200)
    details = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    total_target = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    owner = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('project_detail', kwargs={'pk': self.pk})

    @property
    def progress_percentage(self):
        if self.total_target > 0:
            return min((float(self.current_amount) / float(self.total_target)) * 100, 100)
        return 0

    @property
    def days_left(self):
        from datetime import date
        if self.end_date > date.today():
            return (self.end_date - date.today()).days
        return 0

    @property
    def average_rating(self):
        ratings = self.ratings.all()
        if ratings:
            return sum(r.rating for r in ratings) / len(ratings)
        return 0

    @property
    def total_ratings_count(self):
        return self.ratings.count()

    @property
    def total_donations_count(self):
        return self.donations.count()

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='projects/')
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"صورة {self.project.title}"

class ProjectTag(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    tag = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['project', 'tag']

    def __str__(self):
        return f"#{self.tag}"

class Donation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, 
                              related_name='donations')
    donor = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donor.get_full_name()} - {self.amount} egp"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update project current amount
        self.project.current_amount = self.project.donations.aggregate(
            total=models.Sum('amount'))['total'] or 0
        self.project.save()